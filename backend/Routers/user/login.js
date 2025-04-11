import express from 'express';
import login from '../../Controllers/user/login.js';


let loginRouter = express.Router();


loginRouter.post('/signin', login);

export default loginRouter;