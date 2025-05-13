import express from 'express';
import inventory_update from '../../Controllers/accountant/inventory_update.js';

const inventoryUpdate = express.Router();

inventoryUpdate.put('/:id', inventory_update );
export default inventoryUpdate;