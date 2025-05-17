import inventoryModel from "../../Models/inventoryModel.js";
import salesModel from "../../Models/salesModel.js";


let sales_update = async(req, res) =>{
    const {id} = req.params;
    const {obj} = req.body;
    console.log(obj);
    
  
    try{
        let result = await salesModel.findByIdAndUpdate(id, {payment: obj.payment, date: obj.date, mode: obj.payment_type, ref: obj.ref, quantity: obj.quantity, price: obj.price, amount: obj.amount, product_name: obj.product_name});
        if(result && obj.payment == "paid"){
            
        
                  let result1 = await inventoryModel.updateOne( {name: obj.product_name,
                    quantity: {$gte:obj.quantity}

                    }, {$inc: {quantity:   -obj.quantity }}
                   
                )
                   console.log(result1)

            
          
            
           
        }
        res.send({success: true, message: "sales updated successfully"});
        
    }catch(err){
        res.send({success: false, message: err.message})
    }
   
}

export default sales_update;