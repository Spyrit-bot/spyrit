import mongoose from 'mongoose';
export default mongoose.Schema({
  _id: String,
  sim:{type:Boolean,default:true},
  allowrecivesimomessage:{type:Boolean,default:true},
  allowreciveaddmessage:{type:Boolean,default:true},
  
  economy:{
    bal:{type:Number,default:0},
    bank:{type:Number,default:0},
    daily:{type: String, default: ""},
    coinflip:{
      perdas:{type:Number,default:0},
      ganhos:{type:Number,default:0},
      perdido:{type:Number,default:0},
      ganhado:{type:Number,default:0},
      partidastotais:{type:Number,default:0},
      caras:{type:Number,default:0},
      coroas:{type:Number,default:0},
      
    },
    raspadinha:{
      perdeu: {type:Number, default: 0},
      ganhou: {type:Number, default: 0},
      jogos: {type:Number, default: 0},
      perdas: {type:Number, default: 0},
      ganhos: {type:Number, default: 0},
      
    },
    rob:{
      rob_time: {default: 0,type:Number},
      robbed_time: {default: 0,type:Number},
      
    }
  },
  vote:{
    voted: {type: Boolean, default: false}
  },
  bot:{
    blocklist:{
      ative:{type:Boolean,default:false},
      message:{type:String,default:""},
      
    },
    profile:{
      aboutme: {type: String, default:"Eu não tenho um sobre-mim, posso adicionar um com /sobre!"}
    }
  }
},{ _id: false })