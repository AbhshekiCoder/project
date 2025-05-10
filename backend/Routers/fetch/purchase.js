import express from 'express';
import purchase from '../../Controllers/fetch/purchase.js';


let purchaseRouter = express.Router();

purchaseRouter.get('/', purchase);
export default purchaseRouter