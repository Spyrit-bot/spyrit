import {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import userSchema from '../../models/user.js'
export default {
  data: new SlashCommandBuilder()
  .setName("spycoins")
  .setNameLocalization("pt-BR","spycoins")
  .setDescription(`Veja os comandos`)
  .addSubcommand(e=>e.setName("lb").setNameLocalization("pt-BR","placar").setDescription("Veja os mais ricos")
  .addNumberOption(n=>{
    return n.setName("pagina")
    .setDescription("Veja uma página específica")
    .setMinValue(1)
    .setMaxValue(10)
  })),
  run: async(bot,db,i)=>{
    
    let userModel = db.model("user",userSchema)
let usersdb = await userModel.find({ sim:true });
 let page = i.options.getNumber("pagina") || 1
 function getbtn(){
   return new ActionRowBuilder()
   .addComponents(
     new ButtonBuilder()
     .setEmoji("◀️")
     .setCustomId("back")
     .setDisabled(page === 1)
     .setStyle(ButtonStyle.Primary),
     new ButtonBuilder()
     .setEmoji("▶️")
     .setCustomId("next")
     .setDisabled(page === 10)
     .setStyle(ButtonStyle.Primary),
     
    )
 }
 function res(){
    usersdb.sort((a,b)=>{
      return b.economy.bal - a.economy.bal
    })
    usersdb=usersdb.filter(b=>b.economy.bal != Infinity)
    //let usersdb1 =usersdb.slice(0,10)
    let n = 0
    let t = 0;
    usersdb.map((b)=>t+=b.economy.bal)
    let msgs = ``
    let users = usersdb.map(u=>{
    n++
    let musr = bot.users.cache.get(u.id)
    
    let por = ((u.economy.bal/t)*100)
    if(isNaN(por)) por=0
    return `${{ 1: "🥇", 2: "🥈", 3: "🥉"}[n] || `${n}.  `} [${musr?.globalName || musr?.tag}](https://spyrit.squareweb.app/user/${u.id}) - ${process.formatar(u.economy.bal)} - ${por.toFixed(2)}%`
    })
    let embed = new EmbedBuilder()
    .setTitle(`Leaderboard Cash - Página ${page}`)
    .setDescription(`${users.slice((page-1)*10,((page-1)*10)+10).join("\n")}\n\nUsuários: ${usersdb.length}\nTotal: ${process.formatar(t)}`)
    .setColor("#ffffff")
    return {
      content:`${i.user}`,
      embeds:[embed]
    }
  }
    let reply = await i.reply({
      ...res(),
      components:[getbtn()],
      fetchReply:true
    }).catch(()=>{})
    
    if(reply){
      let col = reply.createMessageComponentCollector({
        filter: (e)=>e.user.id == i.user.id,
        time: 3_600_00
      })
      col.on("collect",col=>{
        let id = col.customId;
        if(id==="next"){
          page++;
          col.update({
      ...res(),
      components:[getbtn()],
      fetchReply:true
    }).catch(()=>{})
        }
        if(id==="back"){
          page--;
          col.update({
      ...res(),
      components:[getbtn()],
      fetchReply:true
    }).catch(()=>{})
        }
        
      })
    }
  }
}
