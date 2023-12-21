import { Request, Response } from "express";
import logger from '../utils/logger'
import { createUser } from "../service/user.service";
import { createUserInput } from "../schema/user.schema";
//export async function createUserHandler(req: Request, res: Response) {
export async function createUserHandler(req: Request<{}, {}, createUserInput['body']>, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.status(200).send({ data: user });
    } catch (err:any) {
        logger.error(err)
        return res.status(409).send({ error: err.message });
    }
}
