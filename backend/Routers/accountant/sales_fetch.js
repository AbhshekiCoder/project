import express from 'express';
import cart from '../../Controllers/accountant/cart.js';



let sales_fetch = express.Router();

sales_fetch.get('/sales_fetch',  cart);

export default sales_fetch