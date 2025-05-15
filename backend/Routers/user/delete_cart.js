import express from 'express';
import deleteCart from '../../Controllers/user/deleteCart.js';

const delete_cart = express.Router();

delete_cart.delete('/:id', deleteCart);
export default delete_cart;