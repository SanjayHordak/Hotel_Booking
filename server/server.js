import express from 'express'
import "dotenv/config";
import cors from "cors"
import dbConnect from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';

dbConnect()
const app=express()
app.use(cors()) //enable cross-orgin Resource Sharing

//middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk Webhooks
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req,res)=>res.send("Api is Working"))
const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running successfully on ${PORT}`));