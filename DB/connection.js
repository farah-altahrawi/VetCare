import mongoose from "mongoose";

const connectDB = async()=>{
    return await mongoose.connect(process.env.DB).
    then(()=>{
        console.log("Database connection established");
    }).
    catch((err)=>{
        console.log(`error to connect database: ${err}`);
    })
}

export default connectDB; 