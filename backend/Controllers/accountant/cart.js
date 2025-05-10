import jwt from "jsonwebtoken"
import salesModel from "../../Models/salesModel.js";

let cart = async(req, res) =>{
 

    try{
        let result = await salesModel.find({type: "sale"});
        console.log("jshjd")
        res.send({success: true, data: result});
    }catch(err){
        res.send({success: false, message: err.message})
    }
}

export default cart;