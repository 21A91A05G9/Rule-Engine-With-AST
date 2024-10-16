import express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const app=express();
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb+srv://vasavi_08:37pcW2iDgJMuI6yf@cluster0.yhpakpu.mongodb.net/ruleEngine?retryWrites=true&w=majority')
.then(()=> app.listen(5011))
.then(()=>console.log("Connected to Database & Listening to localhost 5011"))
.catch((err)=>console.log(err));