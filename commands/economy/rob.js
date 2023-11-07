import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("steal")
  .setNameLocalization("pt-BR","roubar")
  .setDescription(`Steal someone`)
  .setDescriptionLocalization("pt-BR","Roube alguém")
  .addUserOption(u=>
  u.setName("user")
  .setNameLocalization("pt-BR","usuário")
  .setDescription("User who will steal")
  .setDescriptionLocalization("pt-BR","Usuário que irá roubar").setRequired(true)),
  run: async (bot,db,i)=>{
    let userModel = db.model("user")
    let transModel = db.model("transactions")
    
    let user = i.options.getUser("user")
    let value = (+(Math.random()*.19).toFixed(4))
    if(user.id === i.user.id) return i.reply(`Você não pode se roubar`).catch(()=>{})
   let usr1 = await userModel.findOne({ _id: i.user.id })
   let usr2 = await userModel.findOne({ _id: user.id })
   let timerob = (1000*1*3600)
   let timerobbed = (1000*3600*3)
   
   if(usr1.economy.rob.rob_time+timerobbed > Date.now()) return i.reply(`Calma lá, você já roubou recentemente, volte <t:${Math.floor((usr1.economy.rob.rob_time+timerob)/1000)}:R> para roubar novamente.`).catch(()=>{})
   if(usr2.economy.rob.robbed_time+timerobbed > Date.now()) return i.reply(`\`${user.tag}\` foi roubado por alguém nas últimas 3 horas, volte novamente <t:${Math.floor((usr2.economy.rob.robbed_time+timerobbed)/1000)}:R> para o roubar.`).catch(()=>{})
   
   if(usr2?.economy?.bal < 500) return i.reply(`Quem você deseja roubar precisa ter no mínimo ${process.formatar(500)} em seu saldo fora do banco.`).catch(()=>{})
   
   let tx = usr2.economy.bal*value;
   usr1.economy.bal+=tx;
   usr1.economy.rob.rob_time=Date.now()
   usr2.economy.rob.robbed_time=Date.now()
   
   usr2.economy.bal-=tx;
   let trans1 = new transModel({
     userid: i.user.id,
     type:5,
     value: tx,
     user2: user.id,
     timestamp: Date.now()
   })
   let trans2 = new transModel({
     userid: user.id,
     type:5,
     value: 0-tx,
     user2: i.user.id,
     timestamp: Date.now()
   })
   await trans1.save()
   await trans2.save()
   await usr1.save()
   await usr2.save()
   //console.log(process.cmdid)
    return i.reply(`Você roubou com sucesso ${process.formatar(tx)} de \`${user.tag}\`!\nDica: para proteger-se de futuros roubos, lembre-se de usar </bank dep:${process.cmdid["bank"]}> para deixar seu dinheiro seguro!`).catch(()=>{})
  }
}