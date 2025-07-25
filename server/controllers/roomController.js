import Hotel from "../models/hotelModel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Validate inputs
    if (!roomType || !pricePerNight || isNaN(Number(pricePerNight))) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing room data (roomType or pricePerNight).",
      });
    }

    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotels found for this user.",
      });
    }

    // Upload images to Cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    const newRoom = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully", room: newRoom });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



//api to get all rooms

export const getRoom=async(req,res)=>{
    try{
       const rooms=await Room.find({isAvailable:true}).populate({
        path:'hotel',
        populate:{
            path:'owner',
            select:'image'
        }
       }).sort({createdAt:-1})
       res.json({success:true,rooms})
    }catch(err){
        res.json({success:false,message:err.message})
    }
}



//api to get all rooms for a specific hotel

export const getOwnerRoom=async(req,res)=>{
    try{
        const hotelData=await Hotel.findOne({owner:req.auth.userId})
        const rooms=await Room.find({hotel:hotelData._id.toString()}).populate("hotel");
        res.json({success:true,rooms})
    }catch(err){
        res.json({success:false,message:err.message})
    }
}

//api to toggle availability of the room

export const toggleRoomAvailability=async(req,res)=>{
    try{
        const {roomId}=req.body
        const roomData=await Room.findById(roomId)
        roomData.isAvailable=!roomData.isAvailable;
        await roomData.save()
        res.json({success:true,message:"Room Availability Updated"})
    }catch(err){
        res.json({success:false,message:err.message})
    }
}