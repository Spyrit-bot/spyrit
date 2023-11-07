import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription(`Qual meu ping?`),
  run: async(bot,db,i)=>{
 
    i.reply({
      embeds:[new EmbedBuilder()
      .setTitle(`Meu ping`)
      .setColor("#ffffff")
      .setDescription(`O meu ping é ${bot.ws.ping}ms.`)]
    }).catch(()=>{})
  },
  msgrun: async(bot,db,m)=>{
    m.reply({
      embeds:[new EmbedBuilder()
      .setTitle(`Meu ping`)
      .setColor("#ffffff")
      .setDescription(`O meu ping é ${bot.ws.ping}ms.`)]
    }).catch(()=>{})
  }
}