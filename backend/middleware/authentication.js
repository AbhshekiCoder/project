import jwt from 'jsonwebtoken'


let authentication  = (req, res, next) =>{
    let authHeader = req.header("Authorization");
    console.log(authHeader)

   try{
    let token = authHeader.replace("Bearer", "");
    console.log(token)
    if(!token){
        res.status(400).send({success: true, message: "Token is requires"})

    }
    else{
        let decoded = jwt.verify(authHeader.split(" ")[1], '123456');
        req.user = decoded;
        next();
    }
   }catch(err){
    res.send({success: false, message: err.message})
   }

}
export default authentication