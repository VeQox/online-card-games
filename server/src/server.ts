import express, { Express } from "express";
import { userRouter } from "./user/user-router";
import { authRouter } from "./auth/auth-router";
import { createConnection, ensureTablesExist } from "./db/db";
import cors from "cors";
import { Server, createServer } from "http";
import { TokenRepository } from "./token/token-repository";

const port: number = 3000;
const app: Express = express();
const server: Server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {

    if(!req.path.startsWith("/auth")) {
        if(req.headers.authorization) {
            const token = await TokenRepository.get(req.headers.authorization);
            if(!token || token.expires_at < Date.now()) {
                res.status(401).send();
            } 
            TokenRepository.update(token.session_token);
        }
    }

	next();
});
app.use("/auth", authRouter);
app.use("/users", userRouter);

server.listen(port, async () => {
	console.log(`Server listening on port ${port}`);

	let conection = await createConnection();
	await ensureTablesExist(conection);
	conection.close();
});
