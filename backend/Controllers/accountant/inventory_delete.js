import inventoryModel from "../../Models/inventoryModel.js"
const inventory_delete = async(req, res) =>{
    const {id} = req.params;

    const result = await  inventoryModel.findByIdAndDelete(id);
    if(result){
        res.send({success: true, message: "successfully updated"});
    }
}

export default inventory_delete;