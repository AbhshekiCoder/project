import salesModel from "../../Models/salesModel.js";



const deletePurchase = async(req, res) =>{
    let {id} = req.params;

    let result = await salesModel.findByIdAndDelete(id);
    if(result){
        res.send({success: true, message: "purchase deleted successfully"});
    }
}

export default deletePurchase;