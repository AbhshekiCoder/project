import mongoose from "mongoose";
import userModel from "../../Models/userModel.js";
import   bcrypt from 'bcrypt';



let User = async(req, res)=>{
    let {name, email, password, phone, role} = req.body;

    let newPassword = await bcrypt.hash(password, 10);
    try{
        let result = await userModel.findOne({email: email});
        if(result){
            res.status(400).send({success: false, message: "user already registered"});
        }
        else{
            let user = new  userModel({
                name,
                email,
                password: newPassword,
                phone,
                role
            })
    
            let result = await user.save();
            res.status(200).send({success: true, message: "Registered Successfully"})

        }
       
    }catch(err){
        res.status(400).send({success: false, message: err.message})

    }

}

export default User;