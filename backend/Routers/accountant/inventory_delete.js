import express from 'express';
import inventory_delete from '../../Controllers/accountant/inventory_delete.js';
const inventoryDelete = express.Router();

inventoryDelete.delete('/:id', inventory_delete);


export default inventoryDelete