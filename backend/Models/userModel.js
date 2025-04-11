import mongoose from "mongoose";

let UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        
    },
    role:{
        type: String,
        enum: ['manager', 'accountant', 'sellsMan'],
        required: true
    }
})

const userModel = mongoose.model('user', UserSchema);

export default userModel;