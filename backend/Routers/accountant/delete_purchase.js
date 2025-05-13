import express from 'express';
import deletePurchase from '../../Controllers/accountant/deletePurchase.js';

const delete_purchase = express.Router();

delete_purchase.delete('/:id',  deletePurchase);

export default delete_purchase;