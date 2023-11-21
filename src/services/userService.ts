import UserModel, { User } from "../models/userModel";
import WalletModel from "../models/wallet";
import mongoose from "mongoose";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findByEmail(email: string) {
  return UserModel.findOne({
    email,
  });
}

export function getUserById(id: string) {
  return UserModel.findOne(
    {
      _id: id,
    },
    {
      password: 0,
      verificationCode: 0,
      verified: 0,
      _v: 0,
    }
  ).lean();
}

export async function createWallet(id: string) {
  await WalletModel.create({
    userId: new mongoose.Types.ObjectId(id),
  });
}
