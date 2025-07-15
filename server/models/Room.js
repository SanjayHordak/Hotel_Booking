import mongoose from "mongoose";

const roomSchema=new mongoose.Schema({
   hotel:{type:String,ref:"Hotelmodel" ,required:true},
   roomType:{type:String,required:true},
   pricePerNight:{type:Number,required:true},
   amenities:{type:Array,required:true},
   images:[{type:String}],
   isAvailable:{type:Boolean,default:true},
},{timestamps:true})


const Room=mongoose.model("Room",roomSchema)
export default Hotelmodel;