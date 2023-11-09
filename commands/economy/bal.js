import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import userSchema from '../../models/user.js'
export default {
  data: new SlashCommandBuilder()
  .setName("bal")
  .addUserOption(k=>k.setName("user").setDescription("Usuário").setRequired(false))
  .setDescription(`Qual seu saldo?`),
  run: async(bot,db,i)=>{
    let userModel = db.model("user",userSchema)
 let user = i.options.getUser('user') || i.user;
 
       let query = { _id: user.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
let userdb = await userModel.findOneAndUpdate(query, update, options);
 
 if(userdb?.bot?.blocklist?.ative) return i.reply({
   content:`Não é possível ver o saldo de uma pessoa bloqueada em meu sistema.`
 }).catch(()=>{})
 let usersdb = await userModel.find({ sim:true });
 let top = 0;
 usersdb=usersdb.filter(m=>m.economy.bal != Infinity)
 usersdb.sort((a,b)=>{
      return b.economy.bal - a.economy.bal
    })
 usersdb.forEach((v,ind)=>{
   
   if(v._id === user.id) top=ind+1
 })
 let dmsg = ""
 
 let data = new Date()
 let dia = +data.getDate()
 let mes = +data.getMonth()
 let ano = +data.getFullYear()
 
 if((userdb.economy.daily !== process.getdate())) dmsg=`Dica: Você pode pegar o /daily para ganhar dinheiro e poder fazer um monte de coisas!`

    i.reply({
      content: user.id === i.user.id ? `O seu saldo é ${process.formatar(+userdb.economy.bal.toFixed(2))} e você está no top #${top} do ranking.\n${dmsg}` : `O saldo de ${user} é ${process.formatar(+userdb.economy.bal.toFixed(2))} e ele está no top #${top} do ranking.`,
      allowMentions:{parse:[]}
    }).catch(()=>{})
  },
  msgrun: async(bot,db,m,args)=>{
    let userModel = db.model("user",userSchema)
     
 let user = m.author;
 if(args[0]) user = m.mentions.users.first() || bot.users.cache.get(args[0]) || bot.users.cache.find(b=>b?.globalName?.toLowerCase()?.includes(args.join(" ")?.toLowerCase()) || b?.tag?.toLowerCase()?.includes(args.join(" ")?.toLowerCase())) || m.author
let userdb = await userModel.findOneAndUpdate({ _id: user.id}, {}, {upsert:true});
 if(!userdb) return m.reply(`Usuário ${user.globalName || user.username}(${user.tag}/${user.id}) não está em meu sistema, peça para ele uaar um comando meu.`).catch(()=>{})
 if(userdb?.bot?.blocklist?.ative) return m.reply({
   content:`Não é possível ver o saldo de uma pessoa bloqueada em meu sistema.`
 }).catch(()=>{})
 let usersdb = await userModel.find({ sim:true });
 let top = 0;
 usersdb=usersdb.filter(m=>m.economy.bal != Infinity)
 usersdb.sort((a,b)=>{
      return b.economy.bal - a.economy.bal
    })
 usersdb.forEach((v,ind)=>{
   
   if(v._id === user.id) top=ind+1
 })
 let dmsg = ""
 
 let data = new Date()
 let dia = +data.getDate()
 let mes = +data.getMonth()
 let ano = +data.getFullYear()
 
 if(!(userdb.economy.daily != process.getdate())) dmsg=`Dica: Você pode pegar o /daily para ganhar dinheiro e poder fazer um monte de coisas!`

    m.reply({
      content:user.id === m.author.id ? `O seu saldo é ${process.formatar(+userdb.economy.bal.toFixed(2))} e você está no top #${top} do ranking.\n${dmsg}` : `O saldo de ${user} é ${process.formatar(+userdb.economy.bal.toFixed(2))} e ele está no top #${top} do ranking.`,
      allowMentions:{parse:[]}
    }).catch(()=>{})
  },
  
}

