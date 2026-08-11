import { error } from "console";
import { promises } from "dns";
import mongoose ,{Mongoose}  from "mongoose";

const  MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}

let catched :MongooseConnection =(global as any).mongoose

if(!catched) {
catched =(global as any).mongoose = {
    conn : null,promise:null
}
}

export const ConnectToDatabase = async()=>{
    if(catched.conn){
        return catched.conn
    }

    if (!MONGODB_URL)throw new Error("Missing MONGODB_URL")
    
    catched.promise =catched.promise || mongoose.connect(MONGODB_URL,{dbName:'clickpic',bufferCommands:false})

    catched.conn =await catched.promise

    return catched.conn
}