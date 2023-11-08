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
    let types = [
      {
        id:1,
        lose:`%a enviou %v para %u`,
        win:`%a recebeu %v de %u`
      },
      {
        id:2,
        lose:"",
        win:`%a ganhou %v no daily`
      },
      {
        id:3,
        lose:`%a perdeu %v de %u no cara-ou-coroa`,
        win:`%a ganhou %v de %u no cara-ou-coroa`
      },
      {
        id:4,
        lose:`%a perdeu %v na raspadinha`,
        win:`%a ganhou %v na raspadinha`
      },
      {
        id:5,
        lose:`%a foi roubado em %v por %u`,
        win:`%a roubou %v de %u`
      },
      {
        id:6,
        lose:`%a perdeu %v por uma intervenção administrativa`,
        win:`%a ganhou %v por uma intervenção administrativa`
      },
      {
        id:7,
        lose:"",
        win:`%a recebeu %v por votar em mim`
      },
      
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
      
    }).sort((a,b)=>{
      return b.timestamp-a.timestamp
    }).map(n=>{
      let prefix = `<t:${Math.floor(n.timestamp/1000)}:R>`
      let usr = null;
      if(n.user2 != "") usr = bot.users.cache.get(n.user2)?.tag
      let v = types.find(e=>e.id === n.type);
      let lt = `📤 | ${prefix} ${v.lose.replace("%a",iud ? "você" : user.tag).replace("%v",process.formatar(n.value*-1)).replace("%u",usr)}`
      let wt = `📥 | ${prefix} ${v.win.replace("%a",iud ? "você" : user.tag).replace("%v",process.formatar(n.value)).replace("%u",usr)}`
      
      return n.value > 0 ? wt : lt
      
      })
      let mf = filterchoices.find(b=>b.value === filter)
    i.editReply({
      content:`${iud ? "Suas ú" : "As ú"}ltimas 10 transações${iud ? "" :` de ${user.tag}`}${filter ? ` com o filtro para apenas ${mf?.name}:` : ':'}`,
      embeds:[
        new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${usrtransactions.length != 0 ? usrtransactions.slice(0,10).join("\n") : `Vazia, igual minha carteira`}`)]
    }).catch(()=>{})
  },
  msgrun: async(bot,db,i,args)=>{
    let trans = db.model("transactions")
    let user = i.mentions.users.first() || bot.users.cache.get(args[0]) || i.author
    let filter = null
    let iud = user.id === i.author.id
    let usrtransactions = await trans.find({ userid: user.id })
    usrtransactions=usrtransactions.filter(b=>{
      if(!filter) return b;
      if(Number(b.type) === Number(filter)) return b;
      
    }).sort((a,b)=>{
      return b.timestamp-a.timestamp
    }).map(n=>{
      let prefix = `<t:${Math.floor(n.timestamp/1000)}:R>`
      let usr = null;
      if(n.user2 != "") usr = bot.users.cache.get(n.user2)?.tag
      let v = types.find(e=>e.id === n.type);
      let lt = `📤 | ${prefix} ${v.lose.replace("%a",iud ? "você" : user.tag).replace("%v",process.formatar(n.value*-1)).replace("%u",usr)}`
      let wt = `📥 | ${prefix} ${v.win.replace("%a",iud ? "você" : user.tag).replace("%v",process.formatar(n.value)).replace("%u",usr)}`
      
      return n.value > 0 ? wt : lt
      
      })
      let mf = filterchoices.find(b=>b.value === filter)
    i.reply({
      content:`${iud ? "Suas ú" : "As ú"}ltimas 10 transações${iud ? "" :` de ${user.tag}`}${filter ? ` com o filtro para apenas ${mf?.name}:` : ':'}`,
      embeds:[
        new EmbedBuilder()
        .setColor("#ffffff")
        .setDescription(`${usrtransactions.length != 0 ? usrtransactions.slice(0,10).join("\n") : `Vazia, igual minha carteira`}`)]
    }).catch(()=>{})
  }
}