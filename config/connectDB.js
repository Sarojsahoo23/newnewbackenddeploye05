import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
if(!process.env.MONGODB_URL){
    throw new Error (
        "please provid mangodb url"
    )
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("CONNECT DB")
    } catch (error) {
        console.log("mangodb failed ",error)
        process.exit(1)
    }
    
}


export default connectDB;