import {ActivityType} from 'discord.js';
export default {
  name:"ready",
  run: async (bot,db)=>{
    console.log(`🤖 | Bot ligado: ${bot.user.tag}`)
    bot.user.setActivity({
      name:`/numberbet`,
      type:ActivityType.Listening
    })
    
  }
}