import mongoose from 'mongoose';
export default mongoose.Schema({
  userid: String,
  guildid: String,
  xp:{type: Number, default: 0},
  level:{type: Number, default: 1},
  boost:{type: Number, default: 1},
})