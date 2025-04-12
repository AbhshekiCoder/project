import mongoose from "mongoose";
import { type } from "os";


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
        
       },
       type:{
              type: String,
              require: true
       }
})

let inventoryModel = mongoose.model("inventory", inventorySchema);
export default inventoryModel;