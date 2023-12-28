import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
dotenv.config();
mongoose
    .connect("mongodb+srv://freefire62066:freefire62066@cluster0.z8dtpou.mongodb.net/real-state?retryWrites=true&w=majority").then(() => {
        console.log('connected');
    })
    .catch((err) => {
        console.log(err);
    });


const app = express();
app.use(express.json());




app.listen(3000, () => {
    console.log('server is Running on 3000!');
})

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});