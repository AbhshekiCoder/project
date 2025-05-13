import express from 'express';
import cartModel from '../../Models/cartModel.js';
import jwt from 'jsonwebtoken';

let cart = async(req, res) =>{
    let {name, price, quantity, user_id, product_id, CGST, SGST, HSN} = req.body;
    let user = jwt.decode(user_id);
    console.log( CGST)

    try{
        let result = await cartModel.findOne({$and:[{product_id: product_id}, {user_id: user.id}]});
        
        if(!result){
           
            let cart = new cartModel({
                name,
                price,
                quantity,
                user_id: user.id,
                product_id,
                CGST,
                SGST,
                HSN


            })
            let result = await cart.save();
    
            res.send({success: true, message: "updated successfully"});
          

        }
        else if(quantity < 1){
            let result = await cartModel.deleteOne({$and:[{user_id: user.id}, {product_id: product_id}]})
            res.send({success: true, message: "updated successfully"});
        }
        else{
          
            let result = await cartModel.updateOne({user_id: user.id, product_id: product_id}, {$set: {quantity: quantity}})
            
            res.send({success: true, message: "updated successfully"});
        }

        

    }catch(err){
        res.send({success: false, message: err.message})
        console.log(err.message)
    }

}
export default cart;