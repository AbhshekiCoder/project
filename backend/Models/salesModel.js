import mongoose from "mongoose";




let salesSchema = new mongoose.Schema({
    product_name:{
        type: String,
        require: true
    },
    product_id:{
        type: String,
        require: true
    },
    accountant_id:{
        type: String,
        default: "" 
    },
    price:{
        type: Number,
        require: true

    },
    quantity:{
        type: Number,
        require: true
    },
    payment:{
        type: String,
        enum: ["half", "paid", "unpaid"],
        default: "unpaid"
    },
    
    type:{
        type: String,
        enum: ["sale", "purchase"],
        default: "sale"

    },
    date:{
    
        
    },
    time:{

    },
    
    CGST:{
        type: Number,

 },
 SGST:{
        type: Number

 },
 HSN:{
        type: Number
 },
 customerId:{

 },
 customerName:{

 },
 mode:{
    type: String,
    enum: ["cash", "cheque", "upi", "card", "online"],
    default: "cash"

 },
 salesMan:{

 },
 distributor:{

 },
 ref:{

 },
 amount:{

 }

 

});

let salesModel = mongoose.model("sales", salesSchema);

export default salesModel;