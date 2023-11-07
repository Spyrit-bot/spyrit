import { 
  SlashCommandBuilder, 
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from 'discord.js';
import userSchema from '../../models/user.js'
import transactionsSchema from '../../models/transactions.js'

export default {
  data: new SlashCommandBuilder()
  .setName("coinflip")
  .setNameLocalizations({
    'pt-BR':`cara-ou-coroa`
  })
  .addSubcommand(cmd=>cmd.setName("bet").setDescription("Aposta no cara ou coroa")
  .addUserOption(k=>k.setName("usuario").setDescription("Escolha um usuário para apostar com você").setRequired(true))
  .addStringOption(k=>k.setName("valor").setDescription("Valor").setRequired(true).setAutocomplete(true))
  )
  .addSubcommand(cmd=>cmd.setName("status").setDescription(`Veja os status`))
  .setDescription(`cara-ou-coroa comandoa`),
  run: async(bot,db,i)=>{
    
    let bots = process.bots
    let model = db.model("user")
    let TranModel = db.model("transactions")
    let subcmd = i.options.getSubcommand()
    
    let usr = await model.findOneAndUpdate({ _id: i.user.id },{},{upsert:true})
    if(subcmd === "bet"){
    let cara = Math.floor(Math.random() * 100) >= 50;
    let valor = i.options.getString("valor")
    let user = i.options.getUser("usuario")
    
    if(user.id === i.user.id) return i.reply({ content: `${i.user.tag} apostou ${process.formatar(valor)} com ele mesmo e perdeu. Brincadeiras a parte, não é possível apostar com você mesmo. `}).catch(()=>{})
    
    let usr1 = await model.findOneAndUpdate({ _id: i.user.id },{},{upsert:true})
    let usr2 = await model.findOne({ _id: user.id },{},{upsert:true})
    if(!usr2){
      await usr2.save()
    }
    if(valor === 'all'){
      if(usr1.economy.bal < usr2?.economy?.bal) valor = usr1?.economy?.bal
      else valor = usr2?.economy?.bal
    }
    if(isNaN(+valor)) return i.reply({
      content:`Precisa ser um número ou all!`
    }).catch(()=>{})
    if(usr1.economy.bal < valor) return i.reply({ content: `Você não tem esse valor. `}).catch(()=>{})
    if(usr2.economy.bal < valor) return i.reply({ content: `${user.tag} não tem esse valor. `}).catch(()=>{})
    
    if(usr1.economy.daily != process.getdate()) return i.reply({
      content:`Você precisa pegar o /daily para apostar!`
    }).catch(()=>{})
    if(!bots.includes(user.id)){
    if(usr2.economy.daily != process.getdate()) return i.reply({
      content:`${user} precisa pegar o /daily para apostar!`
    }).catch(()=>{})
    }
    let btn = new ButtonBuilder()
    .setLabel("Confirmar (0/2)")
    .setCustomId("confirm")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("1062393674178244680")
    let btn1 = new ButtonBuilder()
    .setLabel("Confirmar (1/2)")
    .setCustomId("confirm")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("1062393674178244680")
    let btn2 = new ButtonBuilder()
    .setLabel("Confirmar (2/2)")
    .setCustomId("confirm")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true)
    .setEmoji("1062393674178244680")
    let ar1 = new ActionRowBuilder().addComponents(btn)
    let ar2 = new ActionRowBuilder().addComponents(btn1)
    let ar3 = new ActionRowBuilder().addComponents(btn2)
    async function end(e){
      usr1 = await model.findOneAndUpdate({ _id: i.user.id },{},{upsert:true})
      usr2 = await model.findOneAndUpdate({ _id: user.id },{},{upsert:true}
     )
    
    if(usr1.economy.bal < valor) return e.update({ components:[ar3], content: `Não pode ser finalizado esse cara-ou-coroa pois ${i.user} não tem mais o dinheiro. `}).catch(()=>{})
    if(usr2.economy.bal < valor) return e.update({ components:[ar3], content: `Não pode ser finalizado esse cara-ou-coroa pois ${user} não tem mais o dinheiro. `}).catch(()=>{})
    let cara = Math.floor(Math.random() * 100) >= 50
    let val = valor
    if(cara){
      usr1.economy.bal-=val;
      usr2.economy.bal+=val*0.95;
      usr1.economy.coinflip.perdas++
      usr1.economy.coinflip.perdido+=val;
      usr1.economy.coinflip.caras++
      usr1.economy.coinflip.partidastotais++
      usr2.economy.coinflip.ganhos++
      usr2.economy.coinflip.ganhado+=val;
      usr2.economy.coinflip.caras++
      usr2.economy.coinflip.partidastotais++
      
      let tranuser1 = new TranModel({
        userid: i.user.id,
        type: 3,
        value:0-val,
        user2: user.id,
        timestamp: Date.now()
      })
      let tranuser2 = new TranModel({
        userid: user.id,
        type: 3,
        value:val,
        user2: i.user.id,
        timestamp: Date.now()
      })
      await tranuser1.save();
      await tranuser2.save();
      
      await usr1.save();
      await usr2.save();
      
      e.update({
        components:[ar3],
        content:`Deu cara e com sucesso ${user} ganhou ${process.formatar(val*0.95)} com taxas de ${i.user}.`
      }).catch(()=>{})
    }else{
      usr2.economy.bal+=val*.95;
      usr2.economy.bal-=val;
      usr2.economy.coinflip.perdas++
      usr2.economy.coinflip.perdido+=val;
      usr2.economy.coinflip.coroas++
      usr2.economy.coinflip.partidastotais++
      usr1.economy.coinflip.ganhos++
      usr1.economy.coinflip.ganhado+=val;
      usr1.economy.coinflip.coroas++
      usr1.economy.coinflip.partidastotais++
      
      let tranuser1 = new TranModel({
        userid: i.user.id,
        type: 3,
        value:val,
        user2: user.id
      })
      let tranuser2 = new TranModel({
        userid: user.id,
        type: 3,
        value:0-val,
        user2: i.user.id
      })
      await tranuser1.save();
      await tranuser2.save();
      await usr1.save();
      await usr2.save();
      e.update({
        components:[ar3],
        content:`Deu coroa e com sucesso ${i.user} ganhou ${process.formatar(val*0.95)} com taxas de ${user}!`
      }).catch(()=>{})
    }
      
    }
    let user1used = false
    let user2used = false
    
    let rep = await i.reply({
      fetchReply: true,
      content:`${user}, ${i.user} gostaria de apostar no cara-ou-coroa com você num valor de ${process.formatar(valor)}! Se der cara, você ganha ${process.formatar(valor*0.95)} e ${i.user} perde ${process.formatar(valor)}, caso de coroa, você perde ${process.formatar(valor)} e ${i.user} ganha ${process.formatar(valor*0.95)}!\nObs: não tem técnicas para vencer, é só sorte! Não fique jogando antes ou depois do adversário, pois a moeda já caiu e só esta esperando a confirmação dos dois!`,
      components:[ar1]
    }).catch(()=>{})
    if(!rep) return;
    if(bots.includes(user.id)){
      i.editReply({
        components:[ar2]
      }).catch(()=>{})
      user2used=true
      if(user1used) end()
    }
   
   let collector = rep.createMessageComponentCollector({
filter: (e) => e.user.id === i.user.id || e.user.id === user.id })
collector.on("collect",e=>{
  if(e.user.id === i.user.id && !user1used){
    user1used=true;
    if(user2used) end(e)
    else e.update({ components:[ar2] }).catch(()=>{})
  }
  if(e.user.id === user.id && !user2used){
    user2used=true;
    if(user1used) end(e)
    else e.update({ components:[ar2] }).catch(()=>{})
  }
  
})
}else{
      let {perdas,ganhos,perdido,ganhado,partidastotais} = usr.economy.coinflip;
      let porg = +((ganhos/partidastotais)*100).toFixed(2)
      let porp = +((perdas/partidastotais)*100).toFixed(2)
      let porg1 = +((ganhado/(ganhado+perdido))*100).toFixed(2)
      let porp1 = +((perdido/(ganhado+perdido))*100).toFixed(2)
      
      if(isNaN(porg)) porg=0;
      if(isNaN(porp)) porp=0;
      if(isNaN(porg1)) porg1=0;
      if(isNaN(porp1)) porp1=0;
      
      let emb = new EmbedBuilder()
      .setTitle("Status Coinflip")
      .setColor("#ffffff")
      .setDescription(`**            **Ganhos\nGanhos: ${process.formatar(ganhos,true)} (${porg}%)\nGanhou: ${process.formatar(ganhado)} (${porg1}%)\n\n**            **Perdas\nPerdas: ${process.formatar(perdas,true)} (${porp}%)\nPerdeu: ${process.formatar(perdido)} (${porp1}%)\n\n**            **Geral\nJogos jogados: ${process.formatar(partidastotais,true)}`)
      
      i.reply({ embeds: [emb]}).catch(()=>{})
      /*perdas:{type:Number,default:0},
      ganhos:{type:Number,default:0},
      perdido:{type:Number,default:0},
      ganhado:{type:Number,default:0},
      partidastotais:{type:Number,default:0},
      caras:{type:Number,default:0},
      coroas:{type:Number,default:0},
      */
      }
  },
  ac: async(bot,db,i)=>{
    let n = i.options.getFocused()
    let userModel = db.model("user")
      let user = await userModel.findOneAndUpdate({ _id: i.user.id },{},{ upsert: true })
      if(!user) return i.respond([]).catch(()=>{})
    let bal = +Number(user.economy.bal).toFixed(2)
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
    if(n <= 900000000){
      if(calcrest(n) > 0) a.push(`${n}`)
    if(calcrest(n*10) > 0) a.push(`${n}0`)
    if(calcrest(n*100) > 0) a.push(`${n}00`)
    if(calcrest(n*1000) > 0) a.push(`${n}000`)
    if(calcrest(n*10000) > 0) a.push(`${n}0000`)
    if(calcrest(n*100000) > 0) a.push(`${n}00000`)
    }
    }
    a.push(`${bal}`)
    return i.respond(a.map(b=>{
      if(Number(b) === bal) return { name: `Tudo - ${process.formatar(+b)}`,value:b }
      return { name: `${process.formatar(+b)} - Sobra ${process.formatar(calcrest(+b))}`,value:b }
    })).catch(()=>{})
  }
}