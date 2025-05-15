import cartModel from "../../Models/cartModel.js";



const cart_fetch = async (req, res) =>{
    const {id} = req.params;
   
    let result = await cartModel.find({user_id: id});
    console.log(result)
    if(result>0){
        res.send({success: true, data: result})
    }

}

export default cart_fetch