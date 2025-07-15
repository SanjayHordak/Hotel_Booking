import Hotel from "../models/hotelModel.js"
import {v2 as cloudinary} from 'cloudinary'
import Room from '../models/Room.js'
//api to create new room for a hotel

export const createRoom=async(req,res)=>{
    try{
        const {roomType,pricePerNight,amenities}=req.body;
        const hotel=await Hotel.findOne({owner:req.auth.userId})
        if(!hotel) return res.json({success:true,message:"No Hotels Found"})

            //upload images to cloudinary
            const uploadImages=req.files.map(async(file)=>{
               const response= await cloudinary.uploader.upload(file.path);
               return response.secure_url;
            })
            //wait for all uploads to complete
           const images= await Promise.all(uploadImages)
           await Room.create({
            hotel:hotel._id,
            roomType,
            pricePerNight:+pricePerNight,
            amenities:JSON.parse(amenities),
            images,
           })
           res.json({success:true,message:"Room created Successfully"})
    }catch(err){
        res.json({success:false,message:err.message})
    }
}


//api to get all rooms

export const getRoom=async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err)
    }
}



//api to get all rooms for a specific hotel

export const getOwnerRoom=async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err)
    }
}

//api to toggle availability of the room

export const toggleRoomAvailability=async(req,res)=>{
    try{
        
    }catch(err){
        console.log(err)
    }
}