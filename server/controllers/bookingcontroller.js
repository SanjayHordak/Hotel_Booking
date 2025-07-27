//Function to check Availability of the Room
import express from 'express'
import Booking from "../models/Booking.js"
import Room from "../models/Room.js";
import Hotel from '../models/hotelModel.js';
import transporter from '../configs/nodemailer.js';
import Stripe from 'stripe';

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (err) {
    console.log("Availability check error:", err.message);
    return false; // always return a boolean
  }
};


//API to check availability of the room
// POST/api/bookings/check-availability

export const checkAvailabilityAPI=async(req,res)=>{
    try{
         const {room,checkInDate,checkOutDate}=req.body;
         const isAvailable=await checkAvailability({checkInDate,checkOutDate,room})
         res.json({success:true,isAvailable})
    }catch(err){
        res.json({success:false,message:err.message})
    }
}

//API to create a new booking
//POST/api/bookings/book

export const createBooking=async(req,res)=>{
    try{
        const{room,checkInDate,checkOutDate,guests}=req.body;
        const user=req.user._id;

        //Before booking check Availability
        const isAvailable=await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        })
        if(!isAvailable){
            res.json({success:false,message:"Room Not Available"})
        }
        //Get total price for room
        const roomData=await Room.findById(room).populate("hotel")
        let totalPrice=roomData.pricePerNight;

        //calculate total price based on night

        const checkIn=new Date(checkInDate)
        const checkOut=new Date(checkOutDate)
        const timeDiff=checkOut.getTime()-checkIn.getTime()
        const nights=Math.ceil(timeDiff/(1000*3600*24))
        totalPrice*=nights;
        const booking=await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        const mailOptions={
               from:process.env.SENDER_EMAIL,
               to:req.user.email,
               subject:'Hotel Booking  Details',
               html:`
                 <h2>Your Booking Details</h2>
                 <p>Dear ${req.user.username},</p>
                 <p>Thank you for your Booking! Here are your booking details:</p>
                 <ul>
                 <li><strong>Booking Id: ${booking._id}</li>
                 <li><strong>Hotel Name: ${roomData.hotel.name}</li>
                 <li><strong>Location: ${roomData.hotel.address}</li>
                 <li><strong>Date: ${booking.checkInDate.toDateString()}</li>
                 <li><strong>Booking Amount: ${process.env.CURRENCY || '$'} ${booking.totalPrice}/night</li>
                 </ul>
                 <p>We look forward for welcoming you!</p>
                 <p>If you need to make any changes, feel free to contact us.</p>
                 
               `
        }
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:"Booking created successfully"})

    }catch(err){
        console.log(err)
        res.json({success:false,message:"Failed to create booking"})
    }
}

//API to get all booking for a user
//GET /api/bookings/user

export const getUserBookings=async(req,res)=>{
    try{
        const user=req.user._id;
        const bookings=await Booking.find({user}).populate("room hotel").sort({createdAt:-1})
        res.json({success:true,bookings})
    }catch(err){
        res.json({success:false,message:"Failed to fetch bookings"})
    }
}


export const getHotelBookings=async(req,res)=>{
    try{
        const hotel=await Hotel.findOne({owner:req.auth.userId});
        if(!hotel){
            return res.json({success:false,message:"No Hotel Found"})
        }
        const bookings=await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt:-1})
        //Total Bookings
         const totalBookings=bookings.length;
         //Total Revenue
         const totalRevenue=bookings.reduce((acc,booking)=>acc + booking.totalPrice,0)
         res.json({success:true,dashboardData:{totalBookings,totalRevenue,bookings}})
    }catch(err){
       res.json({success:false,message:"Failed to fetch bookings"})
    }
}

export const stripePayment = async (req, res) => {
  try {
    const { bookingId }=req.body;
    const booking=await Booking.findById(bookingId);
    const roomData=await Room.findById(booking.room).populate('hotel');
    const totalPrice=booking.totalPrice;
    const { origin }= req.headers;

     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
     const line_items = [
      {
        price_data:{
          currency:"usd",
          product_data:{
            name:roomData.hotel.name,
          },
          unit_amount:totalPrice * 100, // Convert to cents
        },
        quantity: 1,
      }
     ]

     //Create Checkout Session
     const session= await stripeInstance.checkout.sessions.create({
      line_items,
      mode:"payment",
      success_url:`${origin}/loader/my-bookings`,
      cancel_url:`${origin}/my-bookings`,
      metadata:{
        bookingId,
      }
     })
     res.json({success: true, url: session.url});

  } catch (error) {
  console.error("Stripe Payment Error:", error); // 👈 See error in terminal
  res.status(500).json({ success: false, message: error.message || "Payment failed" });
}
}

