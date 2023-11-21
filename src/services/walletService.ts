import mongoose from "mongoose";
import TransactionModel from "../models/transactionModel";
import WalletModel, { Wallet } from "../models/wallet";

export const createTransactionInDb = async (
  userId: string,
  walletId: string,
  amount: number,
  type: string,
  session: any
) => {
  return await TransactionModel.create(
    [
      {
        userId: new mongoose.Types.ObjectId(userId),
        walletId: new mongoose.Types.ObjectId(walletId),
        amount,
        type,
      },
    ],
    {
      session,
    }
  );
};

export const updateUserWallet = async (
  userId: string,
  walletId: string,
  amount: number,
  type: string,
  session: any
) => {
  if (type === "CREDIT") {
    return await WalletModel.updateOne(
      {
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(walletId),
      },
      {
        $inc: {
          balance: amount,
        },
      },
      {
        session,
      }
    );
  }

  if (type === "DEBIT") {
    return await WalletModel.updateOne(
      {
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(walletId),
      },
      {
        $inc: {
          balance: -amount,
        },
      },
      {
        session,
      }
    );
  }
};

export const getUserBalance = async (userId: string) => {
  return await WalletModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const getUserTransaction = async (id: string) => {
  return await TransactionModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
};

export const cancelUserTransaction = async (id: string, session: any) => {
  return await TransactionModel.updateOne(
    {
      _id: new mongoose.Types.ObjectId(id),
    },
    {
      isCancelled: true,
    },
    {
      session,
    }
  );
};

export const getUserTransactions = async (userId: string) => {
  return await TransactionModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  });
};
