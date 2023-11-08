import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("vote")
  .setNameLocalization("pt-BR","votar")
  .setDescription(`Vote em mim na Simo BotList`),
  run: async(bot,db,i)=>{
    
   await i.deferReply().catch(()=>{})
 let url = "https://bombadeagua.life/bot/1166885109471907840"
 let userModel = db.model("user")
 let transModel = db.model("transactions")
 
 let votou = await process.simo.votou(i.user.id)
 let user = await userModel.findOneAndUpdate({ _id: i.user.id },{}, { upsert: true })
 if(votou && !user.vote.voted){
   user.economy.bal += 1200;
   user.vote.voted = true
   let trans = new transModel({
     userid: i.user.id,
     value: 1200,
     type: 7,
     timestamp: Date.now()
   })
   await trans.save()
   await user.save();
   let lc = bot.channels.cache.get(process.env.logs);if(lc){lc.send(`${i.user.globalName || i.user.username}(${i.user.tag}/${i.user.id}) ganhou ${process.formatar(1200)} por votar.`).catch(()=>{}) }
   
   return i.editReply(`Obrigada por votar em mim! Já lhe dei ${process.formatar(1200)} em seu saldo! Lembre-se de usar </bank dep:${process.cmdid["bank"]}> para proteger seu saldo e votar em mim 2x por dia!`).catch(()=>{})
 }
 if(votou){
   let tempo = await process.simo.tempovoto(i.user.id)
   
 return i.editReply({ content: `Você já votou em mim e já pegou seu prêmio hoje! Vote novamente <t:${Math.floor(tempo/1000)}:R>!`}).catch(()=>{})
 } else {
   user.vote.voted = true
 
    i.editReply({
      embeds:[new EmbedBuilder()
      .setTitle(`Vote em mim`)
      .setColor("#ffffff")
      .setDescription(`Vote em mim na [Simo's Botlist aqui](${url}) e ganhe:\n- Menos cooldown(3s > 2.1s)\n- Menos taxas no pay(5% > 3%)\n- Mais daily(1x > 1.2x)\n\nObs: caso você já tenha votado e ainda não tenha ido, espere 15 segundos que os dados antigos serão apagados.\nObs: se você votar e usar o comando novamente, você vai ganhar ${process.formatar(1200)}!`)
      ]
    }).catch(()=>{})
    await user.save()
 }
  },
  msgrun: async(bot,db,m)=>{
    

 let url = "https://bombadeagua.life/bot/1166885109471907840"
 let userModel = db.model("user")
 let transModel = db.model("transactions")
 
 let votou = await process.simo.votou(m.author.id)
 let user = await userModel.findOneAndUpdate({ _id: m.author.id },{}, { upsert: true })
 if(votou && !user.vote.voted){
   user.economy.bal += 1200;
   user.vote.voted = true
   let trans = new transModel({
     userid: m.author.id,
     value: 1200,
     type: 7,
     timestamp: Date.now()
   })
   await trans.save()
   await user.save();
   let lc = bot.channels.cache.get(process.env.logs);if(lc){lc.send(`${m.author.globalName || m.author.username}(${m.author.tag}/${m.author.id}) ganhou ${process.formatar(1200)} por votar.`).catch(()=>{}) }
   
   return m.reply(`Obrigada por votar em mim! Já lhe dei ${process.formatar(1200)} em seu saldo! Lembre-se de usar </bank dep:${process.cmdid["bank"]}> para proteger seu saldo e votar em mim 2x por dia!`).catch(()=>{})
 }
 if(votou){
   let tempo = await process.simo.tempovoto(m.author.id)
   
 return m.reply({ content: `Você já votou em mim e já pegou seu prêmio hoje! Vote novamente <t:${Math.floor(tempo/1000)}:R>!`}).catch(()=>{})
 } else {
   user.vote.voted = false
 
    m.reply({
      embeds:[new EmbedBuilder()
      .setTitle(`Vote em mim`)
      .setColor("#ffffff")
      .setDescription(`Vote em mim na [Simo's Botlist aqui](${url}) e ganhe:\n- Menos cooldown(3s > 2.1s)\n- Menos taxas no pay(5% > 3%)\n- Mais daily(1x > 1.2x)\n\nObs: caso você já tenha votado e ainda não tenha ido, espere 15 segundos que os dados antigos serão apagados.\nObs: se você votar e usar o comando novamente, você vai ganhar ${process.formatar(1200)}!`)
      ]
    }).catch(()=>{})
    await user.save()
 }
  },
  
}