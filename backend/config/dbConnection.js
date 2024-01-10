import mongoose from "mongoose";

export const connectDataBase = () => {
    let DB_URI;
    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        DB_URI = process.env.DB_LOCAL_URI;
    } else if(process.env.NODE_ENV === 'PRODUCTION') {
        DB_URI = process.env.DB_URI;
    }
    mongoose.connect(DB_URI).then(conn => {
        console.log(`MongoDB database connected with HOST: ${conn.connection.host}`)
    });
}