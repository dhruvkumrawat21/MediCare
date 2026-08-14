import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://dhruvkumlap21_db_user:Kt3HqeqxcVuzblEQ@cluster0.i3r3itn.mongodb.net/MediCare")
    .then(()=>{
        console.log("DB connected")
    })
}