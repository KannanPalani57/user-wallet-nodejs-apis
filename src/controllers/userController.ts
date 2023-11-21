import { Request, Response } from "express";
import { get } from "lodash";
import { CreateUserInput } from "../schemas/userSchema";
import { createUser, createWallet, getUserById } from "../services/userService";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await createWallet(user && user._id);

    return res.status(200).json({
      status: true,
      message: "User successfully created",
    });
  } catch (e: any) {
    if (e.code === 11000) {
      return res
        .status(409)
        .json({ status: false, message: "Account already exists" });
    }

    return res.status(500).json({
      status: false,
      message: "Something went wrong!, Please try again!",
      error: e,
    });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const accessToken = get(req, "headers.authorization", "").replace(
      /^Bearer\s/,
      ""
    );

    const userId = res.locals.user._id;

    let user = await getUserById(userId);

    if (!user) {
      return res.json({
        status: false,
        message: "User not found!",
      });
    }

    return res.json({
      status: true,
      ...user,
      isAdmin: user && user.isAdmin ? true : false,
      token: accessToken,
    });
  } catch (err) {
    return res.json({
      status: false,
      message: "Something went wrong, Please try again!",
      err,
    });
  }
}

// 403 - validation
// 401 - unauthorized
// 409 - already exist (conflict)
