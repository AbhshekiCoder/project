import mongoose from "mongoose";
import userModel from "../../Models/userModel.js";
import   bcrypt from 'bcrypt';



let User = async(req, res)=>{
    let {name, email, password, phone, role, distributorship} = req.body;

    let newPassword = await bcrypt.hash(password, 10);
    try{
        let result = await userModel.findOne({email: email});
        if(result){
            res.send({success: false, message: "user already registered"});
        }
        else{
            let user = new  userModel({
                name,
                email,
                password: newPassword,
                phone,
                role,
                distributorship
            })
    
            let result = await user.save();
            res.status(200).send({success: true, message: "Registered Successfully"})

        }
       
    }catch(err){
        res.send({success: false, message: err.message})

    }

}

export default User;