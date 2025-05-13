import mongoose from "mongoose";


let cartSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true


    },
    price:{
        type: Number,
        require: true
    },
    quantity:{
        type: Number,
        require: true
    },
    user_id:{
        type: String,
        require: true
    },
    product_id:{
        type: String,
        require: true

    },
    CGST:{
        type: Number

    },
    SGST:{
        type: Number
    },
    HSN:{
        type: Number
    }
})
let cartModel = mongoose.model("cart", cartSchema);
export default cartModel;