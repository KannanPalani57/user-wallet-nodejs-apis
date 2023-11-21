import jwt from "jsonwebtoken";
import config from "config";

export function signJwt(
  object: object,
  keyName: "accessTokenSecretKey" | "refreshTokenSecretKey",
  options?: jwt.SignOptions | undefined
) {
  const signingKey = config.get<string>(keyName);

  return jwt.sign(object, signingKey, {
    ...(options && options),
  });
}

export function verifyJwt(
  token: string,
  keyName: "accessTokenSecretKey" | "refreshTokenSecretKey"
) {
  const signingKey = config.get<string>(keyName);
  try {
    const decoded = jwt.verify(token, signingKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
