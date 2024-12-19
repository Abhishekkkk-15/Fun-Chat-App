import mongoose from 'mongoose'

export const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected")
    } catch (error) {
        console.log("Error while connecting the database :",error)
    }
}