import inventoryModel from "../../Models/inventoryModel.js";


const inventory_update = async(req, res) =>{
    let {id} = req.params;
    let productData = req.body;
    
    let result = await inventoryModel.findByIdAndUpdate(id, productData);
    let result1 = await inventoryModel.find();
    if(result){
        res.send({success: true, data: result1})
    }

}

export default inventory_update;