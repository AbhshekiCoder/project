import cartModel from "../../Models/cartModel.js";
import salesModel from "../../Models/salesModel.js";


  
  
let sales = async(req, res)=>{


  let { products} = req.body;

 
  
  
    try{
        

        let result = await salesModel.insertMany(products);
        let data = await cartModel.deleteMany({user_id: products[0].user_id});
        res.status(200).send({success: true, message: "successfully added"})
        
        
    }catch(err){
        res.status(400).send({success: false, message: err.message})
        console.log(err.message)
    }
        

}
export default sales;