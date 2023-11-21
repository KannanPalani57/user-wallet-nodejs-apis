import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { getServer } from "../utils/server";
import { signJwt } from "../utils/jwt";
import { createWallet } from "../services/userService";

const userId = new mongoose.Types.ObjectId().toString();

let userPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
};

const app = getServer();

describe("wallet", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  describe("create transaction", () => {
    describe("credit transaction with amount of 10", () => {
      it("should update balance of user wallet by 10", async () => {
        let token = signJwt(userPayload, "accessTokenSecretKey");

        let walletId = createWallet(userId);

        const res = await supertest(app)
          .post(`/wallet/${walletId}/transaction`)
          .set("Authorization", token)
          .send({
            amount: 10,
            type: "CREDIT",
          });
        console.log(res.body);
        expect(res.body).toEqual({
          transactionId: expect.any(String),
          message: "OK",
        });
      });
    });
  });

  describe("cancel transaction", () => {
    describe("cancel credit transaction", () => {
      it("should cancel credit transaction update balance for user", async () => {
        let token = signJwt(userPayload, "accessTokenSecretKey");

        let walletId = createWallet(userId);

        const res = await supertest(app)
          .post(`wallet/${walletId}/transaction/transaction_id`)
          .set("Authorization", token)
          .send({
            amount: 10,
            type: "CREDIT",
          });
        console.log(res.body);
        expect(res.body).toEqual({
          transactionId: expect.any(String),
          message: "OK",
        });
      });
    });
  });
});
