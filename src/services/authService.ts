import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import { privateFields, User } from "../models/userModel";
import { signJwt } from "../utils/jwt";

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, "accessTokenSecretKey", {
    expiresIn: "250m",
  });

  return accessToken;
}
