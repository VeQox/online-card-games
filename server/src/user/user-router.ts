import { Router } from "express";
import { UserRepository } from "./user-repository";
import { User } from "./user";
import { Logger } from "../logger/logger";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
    const users = await UserRepository.getAll();
    res.send(200).json(users);
});


userRouter.get("/:username", async (req, res) =>  {
    const username = req.params.username;
    const user = await UserRepository.getByUsername(username);
    if(!user){
        Logger.error(`User with username ${username} not found`);
        res.status(404).send(`User with username ${username} not found`);
        return;
    }
    res.status(200).json(user);
});