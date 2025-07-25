import express from 'express'
import "dotenv/config";
import cors from "cors"
import dbConnect from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

dbConnect()
connectCloudinary()
const app=express()
app.use(cors()) //enable cross-orgin Resource Sharing

//middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk Webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res)=>res.send("Api is Working"))
app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)
const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running successfully on ${PORT}`));