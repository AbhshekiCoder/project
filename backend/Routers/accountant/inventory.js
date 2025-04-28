import express from 'express';
import upload from '../../middleware/multer.js';
import inventory from '../../Controllers/accountant/inventory.js';
import authentication from '../../middleware/authentication.js';



let inventoryRouter = express.Router();

inventoryRouter.post('/inventory',  inventory)

export default inventoryRouter;