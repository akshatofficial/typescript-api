import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSessions,
} from "../service/session.service";
import { validatepassword } from "../service/user.service";
import { signJWT } from "../utils/jwt";
import config from "config";

export async function createSessionHandler(req: Request, res: Response) {
  // validate user's password
  const user = await validatepassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access-token
  const accessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get<string>("accessToken_expiry"),
    }
  );

  // create an refresh-token
  const refreshToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get<string>("refreshToken_expiry"),
    }
  );

  // return the access-token and refresh-token
  return res.status(200).send({ accessToken, refreshToken });
}

export async function getUserSessionshandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  res.status(200).send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  console.log(res.locals.user);
  await updateSessions({ _id: sessionId }, { valid: false });

  return res.status(200).send({
    accessToken: null,
    refreshToken: null,
  });
}
