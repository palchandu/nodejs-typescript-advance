import { Request, Response, response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSessions } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import log from '../utils/logger'
export async function createUserSessionHandler(req: Request, res: Response) {
    // validate user password
    const user = await validatePassword(req.body);
    log.info(user);
    if (!user) {
        return res.status(401).send("Invalid email or password.")
    }
    //create a session
    const session = await createSession(user._id, req.get("user-agent") || "")
    //create a access token
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") }
    )
    //create a refresh token
    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("refreshTokenTtl") }
    )
    //return access and refresh tokens
    return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    console.log("userid", userId);
    const sessions = await findSessions({ user: userId, valid: true });
    console.log("sessions", sessions)
    return res.status(200).send(sessions);

}

export async function deleteSessionsHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;
    const updateSession = await updateSessions({ _id: sessionId }, { valid: false });
    return res.send({
        accessToken: null,
        refreshToken: null
    })
}