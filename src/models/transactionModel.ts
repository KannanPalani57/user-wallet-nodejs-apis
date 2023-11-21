import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from "@typegoose/typegoose";
import mongoose from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Transaction {
  @prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @prop({ required: true })
  walletId: mongoose.Schema.Types.ObjectId;

  @prop({ required: true })
  type: string;

  @prop({ required: false, default: false })
  isCancelled: boolean;

  @prop({ required: true, default: 0 })
  amount: number;
}

const TransactionModel = getModelForClass(Transaction);

export default TransactionModel;
