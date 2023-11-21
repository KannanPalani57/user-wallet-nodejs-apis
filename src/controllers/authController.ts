import { get } from "lodash";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/authSchema";
import { signAccessToken } from "../services/authService";
import { findByEmail } from "../services/userService";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  let { email, password } = req.body;

  let message: string = "Invalid email or password!";

  let user = await findByEmail(email);

  if (!user) {
    return res.json({
      message,
      status: false,
    });
  }

  // if(!user.verified){
  //   return res.json({
  //     status: false,
  //     message: "Please verify your account!"
  //   })
  // }

  const isValidPassword = await user.validatePassword(password);

  if (!isValidPassword) {
    return res.json({
      status: false,
      message,
    });
  }

  const accessToken = signAccessToken(user);

  // const refreshToken = await signRefreshToken({ userId: user._id })

  return res.json({
    status: true,
    message: "Login Successfull!",
    token: accessToken,
    // refreshToken,
    email: user && user.email,
    fullName: user && user.fullName,
    isAdmin: user && user.isAdmin,
  });
}

export async function isUserTokenValid(req: Request, res: Response) {
  try {
    const accessToken = get(req, "headers.authorization", "");

    if (!accessToken) {
      return res.send(false);
    }

    let tokenStatus = verifyJwt(accessToken, "accessTokenSecretKey");

    if (tokenStatus?.valid) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (e) {
    return res.json(false);
  }
}
