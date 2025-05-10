import express from 'express';
import purchase_update from '../../Controllers/accountant/purchase_update.js';

let purchase_update_router = express.Router();

purchase_update_router.put('/', purchase_update);

export default purchase_update_router;