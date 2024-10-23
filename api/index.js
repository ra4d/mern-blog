import express from "express"
import mongoose from "mongoose";

import {config} from "dotenv";
import userRouts from "./routes/user.route.js";
import authRouts from "./routes//auth.route.js";
import postRouts from "./routes/post.route.js"
import commentRouts from "./routes/comment.route.js"
import cookieParser from "cookie-parser";
import path from "path"

config()



const app = express()
const port = process.env.PORT || 4000;

mongoose
.connect(process.env.MONGO)
.then(()=>{
    app.listen(port , ()=>{
        console.log(`server is run on port ${port}`)})
    })
    .catch((err)=>{console.log(err);})
    

const __dirname = path.resolve()


app.use(express.json())
app.use(cookieParser())
app.use("/api/user" , userRouts);
app.use("/api/auth" , authRouts);
app.use("/api/post" , postRouts);
app.use("/api/comment" , commentRouts);

app.use(express.static(path.join(__dirname,'/client/dest')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,  "client" , "dest" , "index.html"))
})


app.use((err , req , res , next)=>{
    const statusCode = err.statusCode || 500 ;
    const message = err.message || "Internal server Error";
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
});


