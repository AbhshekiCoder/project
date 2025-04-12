
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryModel from '../../Models/inventoryModel.js';
import fs from 'fs'
const inventory = async(req, res) =>{
    let {name, price, quantity, file} = req.body;

    try{
        console.log(req.file)
        let _filename = fileURLToPath(import.meta.url);
        let _dirname = path.dirname(_filename);
        let inventory = new inventoryModel({
            name,
            price,
            quantity,
            image: fs.readFileSync(path.join(_dirname + '/images/' + req.file.filename)),
            type: req.file.mimetype
            
        })

        let result = await inventory.save();
        res.status(200).send({success: true, message: "successfully inventory added"});
    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default inventory;