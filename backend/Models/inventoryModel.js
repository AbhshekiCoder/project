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
        type:  Number,
        require: true
       },
       box:{
              type: Number,
              require: true

       },
       image:{
        
       },
       type:{
              type: String,
              require: true
       },
       CGST:{
              type: Number,

       },
       SGST:{
              type: Number

       },
       HSN:{
              type: Number
       }
})

let inventoryModel = mongoose.model("inventory", inventorySchema);
export default inventoryModel;