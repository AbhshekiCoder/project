import express from "express";
import User from "../../Controllers/user/user.js";

const UserRouter = express.Router();

UserRouter.post("/signup",  User)

export default UserRouter;