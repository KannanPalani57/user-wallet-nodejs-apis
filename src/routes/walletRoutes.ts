import express from "express";
import {
  cancelTransaction,
  createTransaction,
  getWalletBalance,
  getWalletTransactions,
} from "../controllers/walletController";
import validateResource from "../middlewares/validateResource";
import {
  cancelTransactionSchema,
  createTransactionSchema,
} from "../schemas/walletSchema";
import requireUser from "../middlewares/requireUser";
const router = express.Router();

router.post(
  "/:walletId/transaction",
  requireUser,
  validateResource(createTransactionSchema),
  createTransaction
);

router.delete(
  "/:wallet_id/transaction/:transaction_id",
  requireUser,
  validateResource(cancelTransactionSchema),
  cancelTransaction
);

router.get("/:wallet_id", requireUser, getWalletBalance);
router.get("/:wallet_id/transaction", requireUser, getWalletTransactions);

export default router;
