import express from 'express';
import cart from '../../Controllers/fetch/cart.js';


let cart_fetch = express.Router();

cart_fetch.get('/:token', cart);

export default cart_fetch;