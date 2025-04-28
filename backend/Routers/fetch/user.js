import express from "express"
import user from "../../Controllers/fetch/user.js";

let userinfo = express.Router();

userinfo.post("/user",  user);

export default userinfo