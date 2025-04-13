import express from 'express';
import sales from '../../Controllers/user/sales.js';



let salesRouter = express.Router();
salesRouter.post('/sales', sales)
  

export default salesRouter;