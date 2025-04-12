import inventoryModel from "../../Models/inventoryModel.js"



const product = async(req, res) =>{
    try{
        let result = await inventoryModel.find();
        if(result){
            res.send({success: true, data: result});
        }
        else{
            res.send({success: false, message: "data not found"})
        }
    }catch(err){
        res.send({success: false, message: err.message})
    }

}

export default product;