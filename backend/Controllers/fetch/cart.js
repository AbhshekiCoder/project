import jwt from "jsonwebtoken"
import cartModel from "../../Models/cartModel.js"

let cart = async(req, res) =>{
    let {token} = req.body;
    let user = jwt.decode(token);

    try{
        let result = await cartModel.find({user_id: user.id});
        res.send({success: true, data: result});
    }catch(err){
        res.send({success: false, message: err.message})
    }
}

export default cart;