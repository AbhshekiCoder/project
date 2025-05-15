import cartModel from '../../Models/cartModel.js'
const deleteCart = async(req, res)=>{
    const {id} = req.params;
    try{
        const result = await cartModel.findByIdAndDelete(id);
        if(result){
            res.send({success: true, message: "successfully updateed"})
        }
    }catch(err){
        console.log(err.message)
    }
}

export default deleteCart;