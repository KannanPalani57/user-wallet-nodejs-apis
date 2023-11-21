import { object, number, string, TypeOf } from "zod";

export const createTransactionSchema = object({
  body: object({
    type: string({
      required_error: "Type is required",
    }),
    amount: number({
      required_error: "Amount is required",
    }),
  }),
  params: object({
    walletId: string({
      required_error: "Wallet Id is required",
    }),
  }),
});

export type CreateTransaction = TypeOf<typeof createTransactionSchema>["body"];
export type CreateTransactionParams = TypeOf<
  typeof createTransactionSchema
>["params"];

export const cancelTransactionSchema = object({
  params: object({
    wallet_id: string({
      required_error: "Wallet Id is required",
    }),
    transaction_id: string({
      required_error: "Wallet Id is required",
    }),
  }),
});

export type CancelTransactionParams = TypeOf<
  typeof cancelTransactionSchema
>["params"];
