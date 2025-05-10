import salesModel from "../../Models/salesModel.js";


  
  
let sales = async(req, res)=>{


  let {name, product_id, quantity, price, customerName, user_id, customerId , date} = req.body;
  
  let month = new Date().getMonth() + 1;
 
  let time = new Date().getHours() + ":" + new Date().getMinutes();
  let salesMan = user_id.name;
  let distributor = user_id.distributorship;
    try{
        let sales = new salesModel({
            product_name:name,
            product_id,
            quantity,
            price,
            date,
            time:time,
            customerId,
            customerName,
            salesMan,
            distributor

               
            
        })

        let result = await sales.save();
        res.status(200).send({success: true, message: "successfully added"})
    }catch(err){
        res.status(400).send({success: false, message: err.message})
        console.log(err.message)
    }

}
export default sales;