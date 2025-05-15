import express  from 'express';
import cart_fetch from '../../Controllers/fetch/cart_fetch.js';



const cartFetch = express.Router();

cartFetch.get('/:id', cart_fetch);

export default cartFetch;