
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryModel from '../../Models/inventoryModel.js';
import fs from 'fs'
const inventory = async(req, res) =>{
    

    try{
      
       
        const {products} = req.body;
        console.log(products);

        // Insert many products at once
       
        let result =  await inventoryModel.insertOne(products);
        res.status(200).send({success: true, message: "successfully inventory added"});
    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default inventory;