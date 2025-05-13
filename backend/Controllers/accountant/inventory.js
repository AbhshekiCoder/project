
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryModel from '../../Models/inventoryModel.js';
import fs from 'fs'
const inventory = async(req, res) =>{
    

    try{
      
       
        const {name, price, quantity, distributor, box, SGST, HSN, CGST, date} = req.body;
        
        let obj = new inventoryModel({ 
            name,
            price, 
            quantity,
            box,
            CGST,
            SGST,
            HSN,
            distributor,
            date
        })
        console.log(date)

        // Insert many products at once
       
        let result =  await obj.save();
        let data = await inventoryModel.find()
        console.log(data)
        res.status(200).send({success: true, message: "successfully inventory added", data: data});
    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default inventory;