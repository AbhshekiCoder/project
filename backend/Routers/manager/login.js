import express from 'express';
import managerSignin from '../../Controllers/manager/managerSignin.js';



let managerRouter = express.Router();


managerRouter.post('/managerSignin',  managerSignin);

export default  managerRouter;