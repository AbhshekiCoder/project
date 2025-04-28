import express from 'express';
import cart from '../../Controllers/user/cart.js';

let cartRouter = express.Router();

cartRouter.post("/cart", cart);
export default cartRouter