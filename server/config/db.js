import mongoose, { mongo } from "mongoose";

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`conneected to MongoDB database ${conn.connection.host}`);
    } catch(error){
        console.log(`Error in MongoDb ${error}`);
    }
}

export default connectDB;