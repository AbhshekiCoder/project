import salesModel from "../../Models/salesModel.js";


  
  
let sales = async(req, res)=>{


  let {product_name, product_id, accountant_id, quantity, price, imageType} = req.body;
  let month = new Date().getMonth()+1
  let d = new Date().getDate() + "/" +  month + "/" + new Date().getFullYear();
  let time = new Date().getHours() + ":" + new Date().getMinutes();
    try{
        let sales = new salesModel({
            product_name,
            product_id,
            accountant_id,
            quantity,
            price,
            date:  d + "," + time,
         
            imageType
        })

        let result = await sales.save();
        res.status(200).send({success: true, message: "successfully added"})
    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default sales;