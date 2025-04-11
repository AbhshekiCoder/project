import mongoose from "mongoose";




let MongoDBConnect = () =>{
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connected")
    }catch(err){
        console.log(err.message)
    }
}

export default MongoDBConnect;