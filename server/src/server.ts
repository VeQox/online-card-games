import { Logger } from "./logger/logger";
import express, { Express } from "express";
import { userRouter } from "./user/user-router";
import { authRouter } from "./auth/auth-router";

const port = 3000;
const app : Express = express();

app.use(express.json());
app.use((req, res, next) => {
    Logger.info(`${req.method} request on ${req.url} with ${req.body}`);
    next();
});
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    Logger.info(`Server listening on port ${port}`);
})