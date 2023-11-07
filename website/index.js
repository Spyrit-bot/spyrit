import cookieParser from 'cookie-parser';
import express from 'express';
import discordOauth from 'discord-oauth2';
import ejs from 'ejs';
import userSchema from '../models/user.js'
import transactionsSchema from '../models/transactions.js'

const app = express();
app.engine("html",ejs.renderFile)
app.listen(process.env.port || 80)
app.use(cookieParser())
const oauth = new discordOauth({
  clientId: "1166885109471907840",
	clientSecret: process.env.secret,
	redirectUri: process.env.redirecturl || "https://spyrit.squareweb.app/api/oauth",
	
})
app.get("/",async(req,res)=>{
  res.render("index.html",{bot: process.bot.user})
})
app.get("/invite",(req,res)=>{
  res.redirect(process.env.addbotredirectweb || "https://discord.com/api/oauth2/authorize?client_id=1166885109471907840&redirect_uri=https%3A%2F%2Fspyrit.squareweb.app%2Fapi%2Foauth&response_type=code&scope=identify%20guilds%20guilds.join%20bot")
})
app.get("/api/oauth",async(req,res)=>{
  if(!req.query.code) return res.redirect(process.env.redirectweb || "https://discord.com/api/oauth2/authorize?client_id=1166885109471907840&redirect_uri=https%3A%2F%2Fspyrit.squareweb.app%2Fapi%2Foauth&response_type=code&scope=identify%20guilds%20guilds.join");
  
  oauth.tokenRequest({
    grantType:"authorization_code",
    code:req.query.code,
    scope:["identify","guilds","guilds join"]
  }).then(async t=>{
//  t)
  res.cookie("token",t.access_token).redirect("/daily")
  
  }).catch((err)=>{
   // console.log(err)
    res.redirect("/api/oauth")
  })
})

app.get("/daily",async(req,res)=>{
  if(!req.cookies.token) return res.redirect("/api/oauth");
  oauth.getUser(req.cookies.token).then(async user=>{
    
    let userModel = process.db.model("user",userSchema)
    let usr = await userModel.findOneAndUpdate({ _id: user.id },{},{upsert:true})
     
    
    if(usr.economy.daily === process.getdate()) return res.render("daily.html",{got:true,user,form:process.formatar})
    else return res.render("daily.html",{got:false,user,form:process.formatar})
  }).catch((err)=>{
   // console.log(err)
    res.redirect("/api/oauth")
  })
})
app.get("/getdaily",async(req,res)=>{
  if(!req.cookies.token) return res.json({ earn:false, message: `Você precisa logar!` })
  oauth.getUser(req.cookies.token).then(async user=>{
    
    let userModel = process.db.model("user",userSchema)
    let usr = await userModel.findOne({ _id: user.id },{},{upsert:true})
     if(!usr) return res.json({ earn:false, message: `Você precisa usar pelo menos um comando meu para pegar o daily!` })
    if(usr.economy.daily === process.getdate()) return res.json({ earn:false, message: `Você já pegou o daily hoje, espere até amanhã!`})
    let ganho = Math.floor((Math.random() * 100000)+100000)/100;
    let votou = await process.simo.votou(user.id)
    if(votou) ganho=ganho*1.2;
    usr.economy.bal += ganho;
    usr.economy.daily  = process.getdate();
   let transactionsModel = process.db.model("transactions",transactionsSchema)
    
    let transacao = new transactionsModel({
      userid: user.id,
      type:2,
      value: Math.floor(ganho*10)/10,
      timestamp:Date.now()
    })
    await transacao.save()
    await usr.save()
    res.json({
      earn:true,
      value: Math.floor(ganho*10)/10,
      voted:votou,
      newbal: Math.floor(usr.economy.bal*10)/10
    })
  }).catch((e)=>{
     return res.json({ message: `Você precisa logar! ${e}` })
  })
})
app.get("/botlist",async(req,res)=>{
  res.redirect("https://bombadeagua.life/bot/1166885109471907840")
})
app.get("/github",async(req,res)=>{
  res.redirect("https://github.com/Spyrit-bot/spyrit")
})
app.get("/discord",async(req,res)=>{
  res.redirect("https://discord.gg/b7ezaDnfFg")
})

