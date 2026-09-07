import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();

export const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.DATABASE_LINK!);
  }
  catch(error){
    console.log(error);
  }
}