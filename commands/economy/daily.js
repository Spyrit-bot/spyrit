import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import userSchema from '../../models/user.js'

export default {
  data: new SlashCommandBuilder()
  .setName("daily")
  .setNameLocalizations({
    'pt-BR':"diário",
    'es-ES':"diario",
    
  })
  .setDescriptionLocalizations({
    'pt-BR':"Pegue o daily",
    "es-ES":"Obtener el diario"
  })
  .setDescription(`Get the daily`),
  run: async(bot,db,i)=>{
    let userModel = db.model("user",userSchema)
       let query = { _id: i.user.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let model = await userModel.findOneAndUpdate(query, update, options);
await model.save()
 if(model.economy.daily === process.getdate()) return i.reply({
   content:`Você já pegou o daily hoje.`,
   ephemeral:false
 }).catch(()=>{})
 i.reply({
  content: `Você pode pegar meu daily pelo meu site [aqui](<https://spyrit.squareweb.app/daily?ref=daily-command-slash&guild_id=${i.guild.id}&channel_id=${i.channel.id}>)!`,
  
}).catch(()=>{})
  },
  msgrun: async(bot,db,i)=>{
    let userModel = db.model("user",userSchema)
       let query = { _id: i.author.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let model = await userModel.findOneAndUpdate(query, update, options);
await model.save()
 if(model.economy.daily === process.getdate()) return i.reply({
   content:`Você já pegou o daily hoje.`,
   ephemeral:false
 }).catch(()=>{})
 i.reply({
  content: `Você pode pegar meu daily pelo meu site [aqui](<https://spyrit.squareweb.app/daily?ref=daily-command-slash&guild_id=${i.guild.id}&channel_id=${i.channel.id}>)!`,
  
}).catch(()=>{})
  },
  
  }