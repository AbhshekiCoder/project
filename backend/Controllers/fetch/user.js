import jwt from "jsonwebtoken";
import userModel from "../../Models/userModel.js";

let user = async(req, res) =>{
    let {token} = req.body;
    let user = jwt.decode(token);
   


    let result = await  userModel.findOne({email: user.id});
    if(result){
        res.send({success: true, data: result});
    }
    else{
        res.send({success: false, message: "invalid login"})
    }

}
export default user;