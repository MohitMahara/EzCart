import mongoose, { mongo } from "mongoose";

const orderScheme = new mongoose.Schema({
    payment_id : {
        type : String, 
        required : true,
        unique : true,
    },

    email : {
        type : String,
        required : true,
    },

    address : {
        type : {},
        required : true
    },

    userName : {
        type : String,
        required : true
    },

    amount : {
        type : Number,
        required : true
    },

    items : {
        type : {},
        required : true,
    }

}, {timestamps : true});

export default mongoose.model("Order", orderScheme);