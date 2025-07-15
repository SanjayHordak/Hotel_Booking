import User from '../models/usermodel.js'

//Middleware check if user is authenticated\

export const protect=async(req,res,next)=>{
    try{
        const {userId}=req.auth;
        if(!userId){
               res.json({success:false,message:"User not Authenticated"})
        }else{
            const user=await User.findById(userId);
            req.user=user;
            next()
        }
    }catch(error){
        console.log(error)
    }
}