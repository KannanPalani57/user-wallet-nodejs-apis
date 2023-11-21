import { Request, Response } from "express";
import {
  CancelTransactionParams,
  CreateTransaction,
  CreateTransactionParams,
} from "../schemas/walletSchema";
import {
  cancelUserTransaction,
  createTransactionInDb,
  getUserBalance,
  getUserTransaction,
  getUserTransactions,
  updateUserWallet,
} from "../services/walletService";
import mongoose from "mongoose";

export const createTransaction = async (
  req: Request<CreateTransactionParams, {}, CreateTransaction>,
  res: Response
) => {
  console.log("hello");
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const { type, amount } = req.body;

    const { walletId } = req.params;

    console.log(res.locals.user._id, "----");

    let userCurrentBalance: any = await getUserBalance(res.locals.user._id);

    console.log("userCurrentBalance", userCurrentBalance);

    userCurrentBalance = 0;

    if (type === "DEBIT" && userCurrentBalance < amount) {
      return res.json({
        status: false,
        message: "Insufficient Balance!",
      });
    }

    // storing transaction to db, it returns the array of transaction
    let transaction = await createTransactionInDb(
      res.locals.user._id,
      walletId,
      amount,
      type,
      session
    );

    //updating user wallet after the transaction
    await updateUserWallet(
      res.locals.user._id,
      walletId,
      amount,
      type,
      session
    );

    // if both db writes complete, commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.json({
      transactionId: transaction && transaction[0] && transaction[0]._id,
      message: "OK",
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();

    return res.json({
      message: "Something went wrong!",
    });
  }
};

export const cancelTransaction = async (
  req: Request<CancelTransactionParams, {}, {}>,
  res: Response
) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { wallet_id, transaction_id } = req.params;

    let transaction = await getUserTransaction(transaction_id);

    if (transaction?.isCancelled) {
      return res.json({
        transaction_id: transaction && transaction?._id,
        status: "Cancelled",
        message: "Transaction already cancelled",
      });
    }

    if (transaction?.type === "DEBIT") {
      await updateUserWallet(
        res.locals.user._id,
        wallet_id,
        transaction?.amount,
        "CREDIT",
        session
      );
    }

    if (transaction?.type === "CREDIT") {
      // let userCurrentBalance = (await getUserBalance(res.locals.user._id))
      //   .balance;
      await updateUserWallet(
        res.locals.user._id,
        wallet_id,
        transaction?.amount,
        "DEBIT",
        session
      );
    }

    cancelUserTransaction(transaction_id, session);

    await session.commitTransaction();
    session.endSession();

    return res.json({
      transaction_id: transaction?._id,
      status: "Cancelled",
      message: "OK",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
  }
};

export const getWalletBalance = async (req: Request, res: Response) => {
  const { wallet_id } = req.params;

  if (wallet_id === undefined || wallet_id === null || wallet_id === "") {
    return res.json({
      status: false,
      message: "Wallet Id is required",
    });
  }

  let userCurrentBalance = (await getUserBalance(res.locals.user._id)).balance;

  return res.json({
    amount: userCurrentBalance,
    message: "OK",
  });
};

export const getWalletTransactions = async (req: Request, res: Response) => {
  const { wallet_id } = req.params;

  if (wallet_id === undefined || wallet_id === null || wallet_id === "") {
    return res.json({
      status: false,
      message: "Wallet Id is required",
    });
  }

  let transactions = await getUserTransactions(res.locals.user._id);

  res.json({
    transactions,
  });
};
