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
  content: `Você pode pegar meu daily pelo meu site [aqui](<https://spyrit.squareweb.app/>)!`,
  
}).catch(()=>{})
  },
  msgru: async(bot,db,m,args)=>{
    let userModel = db.model("user",userSchema)
    let transModel = db.model("transactions")
    
       let query = { _id: m.author.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let model = await userModel.findOneAndUpdate(query, update, options);
await model.save()
 if(model.economy.daily === process.getdate()) return m.reply({
   content:`Você já pegou o daily hoje.`
 }).catch(()=>{})
 
 let ganho = +((Math.random() * 1000)+1000).toFixed(2);
 if(m.author.id == "955095844275781693") ganho=2000.99
 let novosaldo = model.economy.bal + ganho
let ganhob = process.formatar(ganho);
let novosaldob = process.formatar(+novosaldo.toFixed(2));
let votou = await process.simo.votou(m.author.id)
let msg = `Já que você não votou em mim hoje na [Simo's Botlist](<https://spyrit.squareweb.app/botlist>) você deixou de ganhar ${process.formatar(ganho*.2)}(+20%) do daily atual! Lembre-se de votar em mim amanhã antes de pegar o daily para ganhar benefícios e dinheiro!`
if(votou) {
  novosaldo+=ganho*.2;
  msg=`Já que você votou em mim de graça na [Simo's Botlist](<https://spyrit.squareweb.app/botlist>) eu te dei mais ${process.formatar((ganho*.2)*.9)}(+20%) no seu daily!`
}
model.economy.bal+=ganho*.9
model.economy.daily = process.getdate()
let transacao = new transModel({
      userid: m.author.id,
      type:2,
      value: Math.floor(ganho*10)/10,
      timestamp:Date.now()
    })
await transacao.save()
await model.save()
let r = await m.reply({
  content: `Esse comando está disponível para slashs commands! Use /daily.`
}).catch(()=>{})

if(r) m.reply({
  content: `Você pegou o daily hoje, e ganhou: ${ganhob}! Agora você tem ${process.formatar(model.economy.bal)} para usar no bot.\n\n${msg}\nExperimente pegar o daily amanhã pelo meu site!\n<https://spyrit.squareweb.app/>\nJá que você não pegou daily pelo site, eu tirei 10% de sua recompensa diária!`,
  
}).catch(()=>{})
  },
  
}