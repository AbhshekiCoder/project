import mongoose from "mongoose";


let inventorySchema = new mongoose.Schema({
       name: {
        type: String,
        require: true
       },
       price:{
        type:  Number,
        require: true
       },
       quantity:{
        type:  String,
        require: true
       },
       image:{
        
       }
})

let inventoryModel = mongoose.model("inventory", inventorySchema);
export default inventoryModel;