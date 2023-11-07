import {
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';
let filterchoices = [
  
    {name:"Pagamentos",value:"1"},
    {name:"Daily",value:"2"},
    {name:"Coinflip",value:"3"},
    {name:"Raspadinha",value:"4"},
    {name:"Roubos",value:"5"},
    {name:"Intervenção Administrativa",value:"6"},
    {name:"Ganhos por Votar",value:"7"},
    
    ]
export default {
  data: new SlashCommandBuilder()
  .setName("transactions")
  .setNameLocalizations({
    'pt-BR':"transações"
  })
  .addUserOption(t=>t.setName("user").setNameLocalization("pt-BR","usuário").setDescription("O usuário que deseja ver as transações"))
  .addStringOption(t=>t.setName("filter")
  .setDescription("Escolha apenas uma opção para só mostrar ela.")
  .addChoices(
    {name:"Pagamentos",value:"1"},
    {name:"Daily",value:"2"},
    {name:"Coinflip",value:"3"},
    {name:"Raspadinha",value:"4"},
    {name:"Roubos",value:"5"},
    {name:"Intervenção Administrativa",value:"6"},
    {name:"Ganhos por Votar",value:"7"},
    
    
    ))
  .setDescription("Veja as transações"),
  run: async(bot,db,i)=>{
    await i.deferReply().catch(()=>{})
    let trans = db.model("transactions")
    let user = i.options.getUser("user") || i.user
    let filter = i.options.getString("filter")
    let iud = user.id === i.user.id
    let usrtransactions = await trans.find({ userid: user.id })
    usrtransactions=usrtransactions.filter(b=>{
      if(!filter) return b;
      if(Number(b.type) === Number(filter)) return b;
      
    }).map(n=>{
      let prefix = `<t:${Math.floor(n.timestamp/1000)}:R>`
      
      if(n.type == 1){
        let usr = bot.users.cache.get(n.user2)?.tag
        if(n.value > 0) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} recebeu ${process.formatar(n.value)} de ${usr}`
        return ` 📤 | ${prefix} ${iud ? "você" : user?.tag} enviou ${process.formatar(n.value*-1)} para ${usr}`
      }
      if(n.type == 2) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} ganhou ${process.formatar(n.value)} no daily`
    
      if(n.type == 3){
        let usr = bot.users.cache.get(n.user2)?.tag
        if(n.value > 0) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} ganhou ${process.formatar(n.value)} de ${usr} no cara-ou-coroa`
        return ` 📤 | ${prefix} ${iud ? "você" : user?.tag} perdeu ${process.formatar(n.value*-1)} para ${usr} no cara-ou-coroa`
      }
      if(n.type == 4){
        
        if(n.value > 0) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} ganhou ${process.formatar(n.value)} na raspadinha`
        return ` 📤 | ${prefix} ${iud ? "você" : user?.tag} perdeu ${process.formatar(n.value*-1)} na raspadinha`
      }
      if(n.type == 5){
        let usr = bot.users.cache.get(n.user2)?.tag
        if(n.value > 0) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} roubou ${process.formatar(n.value)} de ${usr}.`
        return ` 📤 | ${prefix} ${iud ? "você" : user?.tag} foi roubado em ${process.formatar(n.value*-1)} por ${usr}.`
      }
      if(n.type == 6){
        
        if(n.value > 0) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} ganhou ${process.formatar(n.value)} por uma intervenção administrativa.`
        return ` 📤 | ${prefix} ${iud ? "você" : user?.tag} perdeu ${process.formatar(n.value*-1)} por uma intervenção administrativa.`
      }
      if(n.type == 7) return ` 📥 | ${prefix} ${iud ? "você" : user?.tag} ganhou ${process.formatar(n.value)} por votar em mim`
    
      })
      let mf = filterchoices.find(b=>b.value === filter)
    i.editReply({
      content:`${iud ? "Suas ú" : "As ú"}ltimas 10 transações${iud ? "" :` de ${user.tag}`}${filter ? ` com o filtro para apenas ${mf?.name}:` : ':'}`,
      embeds:[
        new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${usrtransactions.length != 0 ? usrtransactions.slice(usrtransactions.length-10,usrtransactions.length).join("\n") : `Vazia, igual minha carteira`}`)]
    }).catch(()=>{})
  }
}