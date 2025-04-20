import mongoose from "mongoose";


let managerSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
})

let managerModel = mongoose.model("manager", managerSchema);

export default managerModel;