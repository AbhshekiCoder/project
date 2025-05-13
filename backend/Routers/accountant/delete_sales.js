import express from 'express';
import deleteSales from '../../Controllers/accountant/deleteSales.js';

const delete_sales = express.Router();

delete_sales.delete('/:id', deleteSales );
export default delete_sales;