import {Client,
  Collection,
  EmbedBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
  
} from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import db from './db.js'
import { AutoPoster } from "topgg-autoposter"
import userSchema from './models/user.js'
import transactionsSchema from './models/transactions.js'
import guildsSchema from './models/guilds.js'
import guildXpSchema from './models/guildXp.js'

import util from 'util'
dotenv.config()
import("./website/index.js")
let bot = new Client({intents:131071})
process.bot = bot;
process.db = db;
if( process.env.beta != "sim") {
  AutoPoster(process.env.topgg, bot)
}
bot.login(process.env.token)
let cachedvotes = {};
let cachedvotesm = {};
db.model("user",userSchema)
db.model("transactions",transactionsSchema)
db.model("guilds",guildsSchema)
db.model("xp",guildXpSchema)

let cmdget = new Collection()
let cmdset = []
fs.readdirSync("./commands").map(k=>{
  fs.readdirSync("./commands/"+k).map(async t=>{
  let m = (await import(`./commands/${k}/${t}`))?.default
  if(m?.msgrun) cmdget.set(m.data.name,m)
  if(m?.data && (m?.run)) {
    let data = m.data
    //if(process.env.beta === "sim") data.name = `beta-${data.name}`
    m.data=data
    if(m?.run) cmdset.push(data)
    cmdget.set(m.data.name,m)
    
  }
})
})

fs.readdirSync("./events").map(async t=>{
  let m = (await import(`./events/${t}`))?.default
  if(m?.name && (m?.run)) {
    bot.on(m.name,(...e)=>{
      m.run(bot,db,...e)
    })
  }
})
process.simo = {
  votou: async(usrid)=>{
    if(cachedvotes[`${gettime()}${usrid}`]) return cachedvotes[`${gettime()}${usrid}`]
    let ftch = await fetch(`https://bombadeagua.life/api/v1/vote-status/${usrid}`,{
      headers:{ Authorization: process.env.simo }
    }).catch(()=>{})
    
    if(!ftch) return;
    let json = await ftch.json()
    
    cachedvotes[`${gettime()}${usrid}`] = (json.can_vote) === false
    cachedvotesm[`${gettime()}${usrid}`] = Date.now()+(json.rest_time)
    return (json.can_vote) === false
    },
  list: async()=>{
    
    let ftch = await fetch(`https://bombadeagua.life/api/bots/1166885109471907840/votes`,{
      headers:{ Authorization: process.env.simo }
    }).catch(()=>{})
    
    if(!ftch) return [];
    let json = await ftch.json()
    return json
    
    },
    
    tempovoto: async(usrid)=>{
    if(cachedvotesm[`${gettime()}${usrid}`]) return cachedvotesm[`${gettime()}${usrid}`]
    let ftch = await fetch(`https://bombadeagua.life/api/v1/vote-status/${usrid}`,{
      headers:{ Authorization: process.env.simo }
    }).catch(()=>{})
    if(!ftch) return;
    let json = await ftch.json()
    cachedvotesm[`${gettime()}${usrid}`] = Date.now()+(json.rest_time)
    return Date.now()+(json.rest_time)
    },
  
}
process.cmdid = {}
bot.on("ready",()=>{
  bot.application.commands.set(cmdset).then(t=>{
    t.map(n=>{
    process.cmdid[n.name] = n.id
    })
  })
})
let timeout = {}
let devs = ["1046844921530818630"]
//cmds
bot.on("interactionCreate",async i => {
  if(i.isAutocomplete()){
    let cmdn = (i.commandName)
    let iswith = cmdn === "bank" && i.options.getSubcommand() === "with"
    let n = process.formatarkbm(i.options.getFocused())
    let userModel = db.model("user")
      let user = await userModel.findOneAndUpdate({ _id: i.user.id },{},{ upsert: true })
      if(!user) return i.respond([]).catch(()=>{})
    let bal = +Number(user.economy.bal).toFixed(2)
    if(iswith) bal=+Number(user.economy.bank).toFixed(2)
    if(n.toLowerCase().startsWith("a")){
      return i.respond([
        { name: `All - ${process.formatar(user.economy.bal)}`,value:`${user.economy.bal}`}
        ]).catch(()=>{})
    }
    n=Number(n)
    if(isNaN(n)) return i.respond([]).catch(()=>{})
    function calcrest(a){
      return bal-a
    }
    let a = []
    
    if(n != 0){
    if(n <= 900000000000){
      if(calcrest(n) > 0) a.push(`${n}`)
    if(n*10 <= 900000000000){ if(calcrest(n*10) > 0) a.push(`${n}0`) }
    if(n*100 <= 900000000000){ if(calcrest(n*100) > 0) a.push(`${n}00`) }
    if(n*1000 <= 900000000000){ if(calcrest(n*1000) > 0) a.push(`${n}000`) }
    if(n*10000 <= 900000000000){ if(calcrest(n*10000) > 0) a.push(`${n}0000`) }
    if(n*100000 <= 900000000000){ if(calcrest(n*100000) > 0) a.push(`${n}00000`) }
    }else{
      a.push("900000000000")
    }
    }
    a.push(`all`)
    return i.respond(a.map(b=>{
      if(b === "all") return { name: `Tudo - ${process.formatar(bal)}`,value:b}
      return { name: `${process.formatar(+b)} - Sobra ${process.formatar(calcrest(+b))}`,value:b }
    })).catch(()=>{})
  
  }
  else if(i.isCommand()){
    if(!i.guild) return
    await process.simo.votou(i.user.id)
    let time = cachedvotes[`${gettime()}${i.user.id}`] ? 2100 : 3000
    
    if(timeout[i.user.id]+time > Date.now()) return i.reply({content: `Calma lá, você poderá usar um comando meu <t:${Math.floor((timeout[i.user.id]+time)/1000)+1}:R>\n${cachedvotes[`${gettime()}${i.user.id}`] ? "" : `Sabia que se você votar em mim pelo comando /vote pode diminuir o tempo de um comando para outro?`}`, ephemeral: true}).catch(()=>{})
    if(i.user.id != "1046844921530818630") 
    timeout[i.user.id]=Date.now()
    
    let user = db.model("user")
    let guildModel = db.model("guilds")
    
    let gld = await guildModel.findOneAndUpdate({ _id: i?.guild?.id },{},{ upsert: true })
    if(gld?.ban?.banned){
      await i.reply({ content: `Você não pode usar meus comandos em esse servidor pois ele foi bloqueado de usar quaisquer comandos meus. Irei me despedir desse servidor <t:${Math.floor((Date.now()+7000)/1000)}:R>. Adeus!\nMotivo do ban: \`${gld.ban.reason}\``}).catch(()=>{})
      setTimeout(()=>{
        i.guild.leave().catch(()=>{})
      },6000)
      return
    }
    let model = await user.findOneAndUpdate({ _id: i.user.id }, {}, { upsert: true })
 

    if(model?.bot?.blocklist?.ative){
      return i.reply({
        content:`❌ | Você foi bloquado de usar a Spyrit. \`${model?.bot?.blocklist?.message}\``
      })
    }
    let cmd = cmdget.get(i.commandName)
    await cmd.run(bot,db,i)
    setTimeout(async()=>{
      let chan1 = Math.floor(Math.random() * 100)
    let chan2 = Math.floor(Math.random() * 100)
    let chan3 = Math.floor(Math.random() * 50)
    let chan4 = Math.floor(Math.random() * 50)
    
    if((chan1 === chan2) && model.allowrecivesimomessage){
      let votou = await process.simo.votou(i.user.id)
      if(!votou) i.followUp({
        content:`Oi, já lembrou de votar em mim na [Simo's Botlist](https://simo-botlist.vercel.app/bot/1166885109471907840) hoje? Votando você ganha um monte de vantagens no bot, como: menos taxas, menos cooldown e muito mais que irá vir!`,
         components:[new ActionRowBuilder()
         .addComponents(new ButtonBuilder().setLabel("Não quero mais receber notificação para votar em mim").setCustomId("naoqueromaisrecebersimo").setStyle(ButtonStyle.Danger))],
        ephemeral:true
      }).catch(console.error)
    }
    if((chan3 === chan4) && model.allowreciveaddmessage) i.followUp({
      ephemeral:true,
      content:`Já pensou em me ter em seu servidor? é possível! Aperte [aqui](https://discord.com/api/oauth2/authorize?client_id=1166885109471907840&permissions=8&scope=applications.commands%20bot) e me adicione logo!\nIsso me ajudaria muito e faria toda a diferença na interação do seu servidor, tá esperando o que?`,
      components:[new ActionRowBuilder()
         .addComponents(new ButtonBuilder().setLabel("Não quero mais receber notificação para me adicionar").setCustomId("naoqueromaisreceberadd").setStyle(ButtonStyle.Danger))]
    }).catch(()=>{})
    },1000)
  }
  else if(i.isButton()){
    if(i.customId === "deleteval" && devs.includes(i.user.id)){
      i.message.delete().catch(()=>{})
      }
    if(i.customId === "naoqueromaisrecebersimo"){
      let user = db.model("user",userSchema)
    let model = await user.findOneAndUpdate({ _id: i.user.id }, {}, { upsert: true })
    model.allowrecivesimomessage = false
    await model.save()
    await i.update({
      content:`Tranquilo, você não irá mais receber mensagem minha pedindo humildemente para você votar em mim na Simo's Botlist!`,
      components:[new ActionRowBuilder()
         .addComponents(new ButtonBuilder().setLabel("Não quero mais receber notificação para votar em mim").setCustomId("naoqueromaisrecebersimo").setStyle(ButtonStyle.Danger).setDisabled(true))]
    }).catch(()=>{})
    }
    if(i.customId === "naoqueromaisreceberadd"){
      let user = db.model("user",userSchema)
    let model = await user.findOneAndUpdate({ _id: i.user.id }, {}, { upsert: true })
    model.allowreciveaddmessage = false
    await model.save()
    await i.update({
      content:`Tranquilo, você não irá mais receber mensagem minha pedindo humildemente para que você me adicione!`,
      components:[new ActionRowBuilder()
         .addComponents(new ButtonBuilder().setLabel("Não quero mais receber notificação para me adicionar").setCustomId("naoqueromaisreceberadd").setStyle(ButtonStyle.Danger).setDisabled(true))]
    }).catch(()=>{})
    }
   
  }
})
bot.on("messageCreate",async m=>{
  if(m.author.bot) return;
  await process.simo.votou(m.author.id)
  if(!m.content.startsWith(process.env.prefixo)) return;
  let args = m.content.split(" ")
  
    let time = cachedvotes[`${gettime()}${m.author.id}`] ? 2100 : 3000
    
    if(timeout[m.author.id]+time > Date.now()) return m.reply({content: `Calma lá, você poderá usar um comando meu <t:${Math.floor((timeout[m.author.id]+time)/1000)+1}:R>\n${cachedvotes[`${gettime()}${m.author.id}`] ? "" : `Sabia que se você votar em mim pelo comando /vote pode diminuir o tempo de um comando para outro?`}`, ephemeral: true}).catch(()=>{})
    
    timeout[m.author.id]=Date.now()
    
  let cmd = args[0].replace(process.env.prefixo,"").toLowerCase()
  if(cmd === "") return;
  args=args.slice(1)
  let comando = cmdget.get(cmd)
  if(comando){
    let user = db.model("user",userSchema)
    let model = await user.findOneAndUpdate({ _id: m.author.id }, {}, { upsert: true })
 

    if(model?.bot?.blocklist?.ative){
      return m.reply({
        content:`❌ | Você foi bloquado de usar a Spyrit. \`${model?.bot?.blocklist?.message}\``
      })
    }
   if(!comando.msgrun) return m.reply({
      content:`Comando existe, mas não tem para comando de prefixo!\nExperimente usar </${cmd}:${process.cmdid[cmd]}>`
    }).catch(()=>{})
    await m.channel.sendTyping().catch(()=>{})
    comando.msgrun(bot,db,m,args)
  }else{
    m.reply({
      content:`Comando não existe, verifique se você errou algo.`
    }).catch(()=>{})
  }
})
bot.on("messageUpdate",async (om,m)=>{
  if(m.author.bot) return;
  await process.simo.votou(m.author.id)
  if(!m.content.startsWith(process.env.prefixo)) return;
  let args = m.content.split(" ")
  
    let time = cachedvotes[`${gettime()}${m.author.id}`] ? 2100 : 3000
    
    if(timeout[m.author.id]+time > Date.now()) return m.reply({content: `Calma lá, você poderá usar um comando meu <t:${Math.floor((timeout[m.author.id]+time)/1000)+1}:R>\n${cachedvotes[`${gettime()}${m.author.id}`] ? "" : `Sabia que se você votar em mim pelo comando /vote pode diminuir o tempo de um comando para outro?`}`, ephemeral: true}).catch(()=>{})
    
    timeout[m.author.id]=Date.now()
    
  let cmd = args[0].replace(process.env.prefixo,"").toLowerCase()
  if(cmd === "") return;
  args=args.slice(1)
  let comando = cmdget.get(cmd)
  if(comando){
    let user = db.model("user",userSchema)
    let model = await user.findOneAndUpdate({ _id: m.author.id }, {}, { upsert: true })
 

    if(model?.bot?.blocklist?.ative){
      return m.reply({
        content:`❌ | Você foi bloquado de usar a Spyrit. \`${model?.bot?.blocklist?.message}\``
      })
    }
   if(!comando.msgrun) return m.reply({
      content:`Comando existe, mas não tem para comando de prefixo!\nExperimente usar </${cmd}:${process.cmdid[cmd]}>`
    }).catch(()=>{})
    await m.channel.sendTyping().catch(()=>{})
    comando.msgrun(bot,db,m,args)
  }else{
    m.reply({
      content:`Comando não existe, verifique se você errou algo.`
    }).catch(()=>{})
  }
})

// menção
bot.on("messageCreate",async m=>{
  let args = m.content.split(" ").slice(1)
  let men = (m.mentions.users.first()) || bot.users.cache.get(args[2])
  if(m.author.bot) return
  if(m.author.id === "1046844921530818630" && m.content.startsWith("sp.ac")){
    let args = m.content.split(" ").slice(1)
    let user = db.model("user",userSchema)
    let trans = db.model("transactions")
    
    if(args[0] == "vv"){
      let usr = await process.simo.votou(men?.id || m.author.id)
      if(usr) m.react("✅").catch(()=>{})
      else m.react("❌").catch(()=>{})
    }
    if(args[0] == "vl"){
      let bots = await process.simo.list()
      m.reply(`${bots.length != 0 ? bots.sort((a,b)=>{
        return b.votes-a.votes
      }).map(y=>{
        let usr = bot.users.cache.get(y.user)
        usr=`[${usr?.globalName}](<https://spyrit.squareweb.app/user/${usr?.id}>)`
        return `${usr} - ${y.votes} voto${y.votes != 1 ? "s" : "" }`
      }).join("\n") : `Sem votos`}`)
    }
    
    if(args[0] === "ban"){
      let args = m.content.split(" ")
    let motivo = args.slice(3).join(" ")
   await user.findOneAndUpdate({
     _id: men?.id
   },{
     bot:{
       
       blocklist:{
         ative:true,
         message: motivo || "Muito lindo para me usar"
       }
     }
     
   })
   await m.react("✅").catch(()=>{})
  
    }
    if(args[0] === "unban"){
      let args = m.content.split(" ")
    let motivo = args.slice(3).join(" ")
   await user.findOneAndUpdate({
     _id: men?.id
   },{
     bot:{
       
       blocklist:{
         ative:false,
         message: motivo || "Muito lindo para me usar"
       }
     }
     
   })
   await m.react("✅").catch(()=>{})
  
    }
    
    if(args[0] === "ac" || args[0] === "rc" || args[0] === "sc"){
      let v = +args[2]
      if(isNaN(v)) return m.react("❌").catch(()=>{})
      
    let query = { _id: men.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    let at = await user.findOneAndUpdate(query, update, options);
    
    let saldoantigo = at.economy.bal
      if(args[0] === "ac") at.economy.bal+= v
      if(args[0] === "rc") at.economy.bal-= v
      if(args[0] === "sc") at.economy.bal = v
      let transaction = new trans({
      userid: men.id,
      type: 6,
      value: at.economy.bal-saldoantigo,
      timestamp: Date.now()
    })
      await at.save()
      await transaction.save()
      m.react("✅").catch(()=>{})
    }
    if(args[0] === "ab" || args[0] === "rb" || args[0] === "sb"){
      let v = +args[2]
      if(isNaN(v)) return m.react("❌").catch(()=>{})
      
    let query = { _id: men.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
    
    let at = await user.findOneAndUpdate(query, update, options);
    let saldoantigo = at.economy.bank
      if(args[0] === "ab") at.economy.bank += v
      if(args[0] === "rb") at.economy.bank -= v
      if(args[0] === "sb") at.economy.bank = v
      let transaction = new trans({
      userid: men.id,
      type: 6,
      value: at.economy.bank-saldoantigo,
      timestamp: Date.now()
    })
      await at.save()
      await transaction.save()
      m.react("✅").catch(()=>{})
    }
    if(args[0] === "eval"){
    let button = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
    .setLabel("Apagar")
    .setCustomId("deleteval")
    .setStyle(ButtonStyle.Danger))
    try{
    let ev = await eval(args.slice(1).join(" "))
    if(typeof ev === "object") ev=util.inspect(ev)
    m.reply({
      content:`\`\`\`js\n${String(ev).slice(0,2000-10)}\n\`\`\``,
      components:[button]
    }).catch(console.error)
  }catch(e){
    m.reply({
      content:`\`\`\`js\n${String(e).slice(0,2000-10)}\n\`\`\``,
      components:[button]
    }).catch(()=>{})
  }
  }
   if(args[0] === "rd"){
     let usr = await user.findOneAndUpdate({
       _id:men.id
     },{
     })
     usr.economy.daily = ""
     await usr.save()
     m.react("✅").catch(()=>{})
   }
  }
  
  
  
  if(m.content.startsWith(process.env.prefixo) || m.content.startsWith("sp.")) return
  if(men?.id === bot.user.id){
    if(m.content.toLowerCase().includes("fofa")){
      if(m.content.toLowerCase().includes("não") || m.content.toLowerCase().includes("nao") ||m.content.toLowerCase().includes("na")) m.react("❌").catch(()=>{})
      else m.react("❤️").catch(()=>{})
    }
    m.reply({
      content:`Olá ${m.author}!\nMeu nome é Spyrit, sou apenas uma robô que tem o sonho de ser a melhor! Meu criador é o \`im.etic\`, ele é bem dahora.`
    })
  }
})
process.bots = ["1166885109471907840","1168135071136493619"]
process.formatar = function formatarMoeda(valor,ssc) {
  const formatoMoeda = new Intl.NumberFormat('pt-BR');
  return `${formatoMoeda.format(Number(Number(valor).toFixed(2)))}${ssc ? "" : " SpyCoins"}`;
}
process.formatarkbm = (v) => v.toLowerCase().replace(/k/g, '000').replace(/b/g, '000000000').replace(/m/g, '000000');
function gettime(){
  let t = Date.now()
  
  return Math.floor(t/15000)*15000
}
process.getdate = function getdate(){
  let data = new Date()
  return Buffer.from(`${data.getDate()}${data.getMonth()}${data.getFullYear()}`).toString("base64url")
}