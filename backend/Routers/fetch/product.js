import express from 'express';
import product from '../../Controllers/fetch/product.js';


let product_fetch = express.Router();


product_fetch.get('/product', product);

export default product_fetch