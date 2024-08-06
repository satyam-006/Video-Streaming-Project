import dotenv from 'dotenv';
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})
connectDB()






/*
import express from 'express'
const app = express();

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error:", () => {
            console.log("Application not talk to database")
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Application is listening on PORT ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Erroe:", error)
        throw err
    }
}) */