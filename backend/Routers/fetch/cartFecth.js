import express  from 'express';
import cart_fetch from '../../Controllers/fetch/cart_fetch.js';
import authentication from '../../middleware/authentication.js';



const cartFetch = express.Router();

cartFetch.get('/:id', authentication, cart_fetch);

export default cartFetch;