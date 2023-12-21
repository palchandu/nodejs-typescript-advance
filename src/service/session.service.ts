import { Session } from "inspector";
import SessionModel, { SessionDocument } from "../models/session.model";
import { FilterQuery, UpdateQuery } from "mongoose";
import { verify } from "crypto";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { get } from "lodash";
import { finduser } from "./user.service";
import config from "config";

export async function createSession(userId: string, userAgent: string) {
    const session = await SessionModel.create({ user: userId, userAgent });
    return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.findOne(query).lean();
}

export async function updateSessions(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken);
    if (!decoded || !get(decoded, "_id")) return false;
    const session = await SessionModel.findById(get(decoded, "_id"));
    if (!session || !session.valid) return false;
    const user = await finduser({ _id: session.user });
    if (!user) return false;
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") }
    )

    return accessToken;
}