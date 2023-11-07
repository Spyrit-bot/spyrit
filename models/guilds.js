import mongoose from 'mongoose';
export default mongoose.Schema({
  _id: String,
  logs:{
    members:{
      join:{
        enabled:{type:Boolean, default: false},
        channel_id:{type:String, default: ""}
      },
      leave:{
        enabled:{type:Boolean, default: false},
        channel_id:{type:String, default: ""}
      },
      
    }
  },
  ban:{
    banned:{type:Boolean,default:false},
    reason:{type:String,default:""},
    
  }
})