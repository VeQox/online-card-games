import { createConnection, ensureTablesExist } from "@db/db";
import { TokenService } from "@db/token-service";
import { authRouter } from "@router/auth-router";
import { userRouter } from "@router/user-router";
import cors from "cors";
import express, { Express } from "express";
import { Server, createServer } from "http";

const port: number = 3000;
const app: Express = express();
const server: Server = createServer(app);

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {

    if(!req.path.startsWith("/auth")) {
        if(req.headers.authorization) {
            const token = await TokenService.get(req.headers.authorization);
            if(!token || token.expires_at < Date.now()) {
                res.status(401).send();
            } 
            TokenService.update(token.session_token);
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