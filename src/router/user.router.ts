import { Request, Response,Router } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource"
import { userSchema } from "../schema/user.schema";
import { createUserSessionHandler, getUserSessionsHandler } from "../controller/session.controller";
import { createSessionSchema } from "../schema/session.schema";
import requireUser from "../middleware/requireUser";

const route = Router();
route.post('/register', validateResource(userSchema), createUserHandler)
route.post('/session', validateResource(createSessionSchema), createUserSessionHandler);
route.get('/sessions', requireUser,getUserSessionsHandler)
export default route;