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
export class Wallet {
  @prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @prop({ required: true, default: 0 })
  balance: number;
}

const WalletModel = getModelForClass(Wallet);

export default WalletModel;
