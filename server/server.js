import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoute from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoutes.js";
import stripe from "./routes/stripe.js";

const app = express();

// config env
dotenv.config()
connectDB();

app.use("/api/v1/checkout", stripe);


// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product',productRoutes )



const PORT = process.env.PORT || 8000;


app.get('/', (req, res) =>{
   res.send(
    "<h1>Welcome to our app</h1>"
   )
})

app.listen(PORT, () =>{
    console.log(`app is listening at ${PORT}`);
})


