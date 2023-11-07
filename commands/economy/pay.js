import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import userSchema from '../../models/user.js'
import transactionsSchema from '../../models/transactions.js'
import crypto from 'crypto'
export default {
  data: new SlashCommandBuilder()
  .setName("pay")
  .setNameLocalization("pt-BR","pagar")
  .addUserOption(k=>k.setName("user").setDescription("Usuário")
  .setNameLocalization("pt-BR","usuário").setRequired(true))
  .addStringOption(k=>k.setName("valor").setDescription("Valor").setRequired(true).setAutocomplete(true))
  
  .setDescription(`Faça um pagamento`),
  run: async(bot,db,i)=>{
    let bots = process.bots
    let userModel = db.model("user",userSchema)
    let transactionsModel = db.model("transactions",transactionsSchema)
    
    await i.deferReply().catch(()=>{})
 let user = i.options.getUser('user');
 let val = Number(i.options.getString('valor'))
 if(isNaN(val)) return i.editReply(`O valor não é número.`).catch(()=>{})
 if(user.id === i.user.id) return i.editReply({ content: `Não é possivel transferir dinheiro para você mesmo. `}).catch(()=>{})
       if(val <= 0) return i.editReply({ content: `Não é possivel fazer transferência com valor menor de 0.`}).catch(()=>{})
       if(val > 70000000) return i.editReply({ content: `Não é possivel fazer transferência com um valor maior que 70m.`}).catch(()=>{})
       
let user1 = await userModel.findOne({ _id: i.user.id });
 let user2 = await userModel.findOne({ _id: user.id });
if(!user2) return i.editReply({ content:`Peça para ${user} usar qualquer comando meu.`})
 if(user2?.bot?.blocklist?.ative) return i.editReply({
   content:`Não é possível fazer uma transferência para uma pessoa bloqueada em meu sistema.`
 }).catch(()=>{})
 if(val > user1.economy.bal) return i.editReply({ content: `Não é possivel fazer transferência com um valor inexistente em sua conta.`}).catch(()=>{})
      
      if(user1.economy.daily != process.getdate()) return i.editReply({
        content:`Pegue o /daily antes.`
      }).catch(()=>{})
      if(!bots.includes(user.id)){
      if(user2.economy.daily != process.getdate()) return i.editReply({
        content:`Espere o \`${user.tag}\` pegar o /daily antes.`
      }).catch(()=>{})
      }
      let m = `Já que \`${i.user.tag}\` nem \`${user.tag}\` nem votaram em mim na [Simo's Botlist](<https://bombadeagua.life/bot/1166885109471907840>) adicionei uma taxa de 5%.`
      let tax = 0.05
      
      let vtusr1 = await process.simo.votou(i.user.id)
     if(user.id != bot.user.id){
       if(vtusr1){
        m=`Já que \`${i.user.tag}\` votou em mim na [Simo's Botlist](<https://simo-botlist.vercel.app/bot/1166885109471907840>) de graça diminuí a taxa de 5% para 3%!`
        tax=0.03
      }else{
       let vtusr2 = await process.simo.votou(user.id)
      if(vtusr2){
        m=`Já que \`${user.tag}\` votou em mim na [Simo's Botlist](<https://simo-botlist.vercel.app/bot/1166885109471907840>) de graça diminuí a taxa de 5% para 3%!`
        tax=0.03
      }
      }
     }
     
      user1.economy.bal-=val
      if(!bots.includes(user.id))user2.economy.bal+=val*(1-tax)
     else user2.economy.bal+=val
     let tranuser1 = new transactionsModel({
        userid: i.user.id,
        type: 1,
        value:0-val,
        user2: user.id,
        timestamp: Date.now()
      })
      let tranuser2 = new transactionsModel({
        userid: user.id,
        type: 1,
        value:bots.includes(user.id) ? val : val*(1-tax),
        user2: i.user.id,
        timestamp: Date.now()
      })
      let lc = bot.channels.cache.get(process.env.logs);if(lc){lc.send(`${user.globalName || user.username}(${user.tag}/${user.id}) ganhou ${process.formatar(val)}(Com taxas: ${process.formatar(val*(1-tax))}) do ${i.user.globalName || i.user.username}(${i.user.tag}/${i.user.id}) por uma transferência.`).catch(()=>{}) }
   
      
      
      
      await tranuser1.save()
      await tranuser2.save()
      await user1.save()
      await user2.save()
    if(user.id != bot.user.id)i.editReply({
      content:`O pagamento foi efetuado com sucesso. \`${user.tag}\` recebeu com sucesso ${process.formatar(val*(1-tax))} de \`${i.user.tag}\`.\n\n${m}`,
      allowMentions:{parse:[]}
    }).catch(()=>{})
    else i.editReply({ content: `Muito obrigada pelos humildes ${process.formatar(val)} <3`}).catch(()=>{})
  }
}

