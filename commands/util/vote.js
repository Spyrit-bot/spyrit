import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("vote")
  .setNameLocalization("pt-BR","votar")
  .setDescription(`Vote em mim`),
  run: async(bot,db,i)=>{
 let url = "https://bombadeagua.life/bot/1166885109471907840"
 let votou = await process.simo.votou(i.user.id)
 if(votou){
   await i.deferReply().catch(()=>{})
   let tempo = await process.simo.tempovoto(i.user.id)
   
 return i.editReply({ content: `Você já votou em mim hoje! Vote novamente <t:${Math.floor(tempo/1000)}:R>!`}).catch(()=>{})
 }
    i.reply({
      embeds:[new EmbedBuilder()
      .setTitle(`Vote em mim`)
      .setColor("#ffffff")
      .setDescription(`Vote em mim na [Simo's Botlist aqui](${url}) e ganhe:\n- Menos cooldown(3s > 2.1s)\n- Menos taxas no pay(5% > 3%)\n- Mais daily(1x > 1.2x)\n\nObs: caso você já tenha votado e ainda não tenha ido, espere 15 segundos que os dados antigos serão apagados.`)
      ]
    }).catch(()=>{})
  },
  msgrun: async(bot,db,m)=>{
 let url = "https://spyrit.squareweb.app/botlist"
 let votou = await process.simo.votou(m.author.id)
 if(votou){
   let tempo = await process.simo.tempovoto(m.author.id)
   
 return m.reply({ content: `Você já votou em mim hoje! Vote novamente <t:${Math.floor(tempo/1000)}:R>!`}).catch(()=>{})
 }
    m.reply({
      embeds:[new EmbedBuilder()
      .setTitle(`Vote em mim`)
      .setColor("#ffffff")
      .setDescription(`Vote em mim na [Simo's Botlist aqui](${url}) e ganhe:\n- Menos cooldown(1.5s > 1s)\n- Menos taxas no pay(5% > 3%)\n- 20% mais daily\n\nObs: caso você já tenha votado e ainda não tenha ido, espere 15 segundos que os dados antigos serão apagados.`)
      ]
    }).catch(()=>{})
  },
  
}