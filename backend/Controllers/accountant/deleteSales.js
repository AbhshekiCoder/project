import salesModel from "../../Models/salesModel.js";


const deleteSales = async (req, res) =>{
    const {id} = req.params;

    const result = await salesModel.findByIdAndDelete(id);
    if(result){
        res.send({success: true, message: "sales update"});
    }
}
export default deleteSales;