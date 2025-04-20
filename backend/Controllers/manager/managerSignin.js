import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
import managerModel from '../../Models/ManagerModel.js';


dotenv.config();



let managerSignin = async (req, res) =>{
    let {email, password}  = req.body;
    try{
        let result = await managerModel.findOne({email: email});
        if(!result){
            res.status(400).send({success: false, message: "you are not regsitered"});
        }
        else{
            let result1 = await bcrypt.compare(password, result.password);
            if(result1){
               
                let token = jwt.sign({id: result.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
                res.status(200).send({success: true, message: "login successfully", token: token})

            }
            else{
                res.status(400).send({success: false, message: " password  didn't match"});
            }
    
        }
    

    }catch(err){
        res.status(400).send({success: false, message: err.message})
    }

}
export default managerSignin;