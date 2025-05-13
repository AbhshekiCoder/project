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
      
       CGST:{
              type: Number,

       },
       SGST:{
              type: Number

       },
       HSN:{
              type: Number
       },
       distributor:{
              type: String,
            

       },
       date:{
           type: String
              
       }
})

let inventoryModel = mongoose.model("inventory", inventorySchema);
export default inventoryModel;