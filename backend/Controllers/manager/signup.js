import managerModel from "../../Models/managerModel.js";
import bcrypt from "bcrypt";



let signup = async(req, res) =>{
    let {name, email, password} = req.body;
    let newPassword = await bcrypt.hash(password, 10);

    try{
        let result = await managerModel.find();
        console.log(result.length)
        if(result.length> 1){
            res.send({success: false, message: "manager registered limit reached"});
            return;
            
        }
        let result1 = await managerModel.findOne({email: email});
        if(result1){
            res.send({success: false, message: "user already registered"})
        }
        else{
            let manager = new managerModel({
                name,
                email,
                password: newPassword
            })
    
            let result = await manager.save();
            if(result){
                res.send({success: true, message: "successfully registered"})
            }

        }
        
    }catch(err){
        res.send({success: false, message: err.message })

    }
}

export default signup;