import "dotenv/config";
import express from "express"
import type { Express,Request,Response } from "express";
import { prisma } from "./db/prisma";

const app:Express=express();
const port:Number=Number(process.env.PORT)||3000
console.log(process.env.PORT);

app.get("/",(req:Request,res:Response)=>{

  res.send("ubaid world")
  
})

app.listen(port,async()=>{
    try {
    await prisma.$connect();
    console.log("DB Connection Successful");
    
  } catch (error) {
    console.log("DB connection failed due to some issues",error);
    
    process.exit(1);
  }
})