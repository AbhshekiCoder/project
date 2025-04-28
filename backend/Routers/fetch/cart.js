import express from 'express';
import cart from '../../Controllers/fetch/cart.js';


let cart_fetch = express.Router();

cart_fetch.post('/cart_fetch', cart);

export default cart_fetch;