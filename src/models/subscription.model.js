import mongoose from "mongoose";

const subscreiptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, //one who is subscribing
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,  //one who is subscribing
        ref:"User"
    },

},{timestamps:true});

export const Subscription = mongoose.model("Subscription",subscreiptionSchema);