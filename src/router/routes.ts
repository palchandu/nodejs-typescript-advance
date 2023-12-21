import { Express, Request, Response } from "express";
import userRouter from './user.router'
function route(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => { res.sendStatus(200) });
    app.use('/user', userRouter);
}

export default route;