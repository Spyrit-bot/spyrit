import dotenv from 'dotenv';
import mongoose from 'mongoose'
dotenv.config()
mongoose.connect(process.env.mongo).then(()=>console.log("💾 | Mongo Conectado"))

export default mongoose