
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryModel from '../../Models/inventoryModel.js';
import fs from 'fs'
const inventory = async(req, res) =>{
    

    try{
        console.log(req.file)
        let _filename = fileURLToPath(import.meta.url);
        let _dirname = path.dirname(_filename);
       
        const products = req.body;

        // Insert many products at once
       
        let result =  await inventoryModel.insertMany(products);
        res.status(200).send({success: true, message: "successfully inventory added"});
    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default inventory;