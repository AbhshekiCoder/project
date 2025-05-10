import salesModel from '../../Models/salesModel.js';



const purchase = async(req, res) =>{


    let result = await salesModel.find({type: "purchase"});
    console.log(result)
    if(result){
        res.send({success: true, data: result})
    }

}
export default purchase