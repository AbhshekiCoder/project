import express from "express";
import sales_update from "../../Controllers/accountant/sales_update.js";



const sales_update_router = express.Router();
sales_update_router.put("/:id", sales_update );

export default sales_update_router;