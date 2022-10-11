import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJWT, verifyJWT } from "../utils/jwt";
import { findUser } from "./user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  // return session.toJSON();

  return session;
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSessions(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken(refreshToken: string) {
  const { decoded } = verifyJWT(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

//   console.log(get(decoded, "session"));
  const session = await SessionModel.findById({ _id: String(get(decoded, "session")) });

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const newAccessToken = signJWT(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get("accessToken_expiry"),
    }
  );

  return newAccessToken;
}
