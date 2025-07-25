import Hotel from "../models/hotelModel.js";
import User from "../models/usermodel.js";

export const registerHotel=async(req,res)=>{
    try{
         const{name,address,contact,city}=req.body
         const owner=req.user._id

         //check if user already registered

        const hotel=await Hotel.findOne({owner})
        if(hotel){
            return res.json({success:true,message:"Hotel already Registered"})
        }
        await Hotel.create({name,address,contact,city,owner});
        await User.findByIdAndUpdate(owner,{role:"hotelOwner"});
        res.json({success:true,message:"Hotel Registered Successfully"})

    }catch(err){
        res.json({success:false,message:err.message})
    }
}