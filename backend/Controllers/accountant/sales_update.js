import salesModel from "../../Models/salesModel.js";


let sales_update = async(req, res) =>{
    const {id} = req.params;
    const {obj} = req.body;
  
    try{
        let result = await salesModel.findByIdAndUpdate(id, {payment: obj.payment, date: obj.date, mode: obj.payment_type, ref: obj.ref});
        if(result){
            res.send({success: true, message: "sales updated successfully"});
           
        }
        
    }catch(err){
        res.send({success: false, message: err.message})
    }
   
}

export default sales_update;