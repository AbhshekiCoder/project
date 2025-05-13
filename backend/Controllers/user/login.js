import jwt from 'jsonwebtoken';
import userModel from '../../Models/userModel.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';


dotenv.config();



let login = async (req, res) =>{
    let {email, password}  = req.body;
    try{
        let result = await userModel.findOne({email: email});
        if(!result){
            res.send({success: false, message: "you are not regsitered"});
        }
        else{
            let result1 = await bcrypt.compare(password, result.password);
            if(result1){
               
                let token = jwt.sign({id: result.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
                res.status(200).send({success: true, message: "login successfully", token: token, role: result.role, data: result})

            }
            else{
                res.send({success: false, message: " password  didn't match"});
            }
    
        }
    

    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default login;