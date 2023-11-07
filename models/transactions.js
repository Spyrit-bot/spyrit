import mongoose from 'mongoose';
import crypto from 'crypto'
export default mongoose.Schema({
  userid: String,
  type: Number,
  value:Number,
  user2:{type:String, default:""},
  timestamp:{type:Date,default:Date.now}
})