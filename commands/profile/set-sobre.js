import {
  SlashCommandBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("sobre")
  .setDescription(`Muda seu sobremim`)
  .addStringOption(b=>b 
  .setName("texto")
  .setRequired(true)
  .setMinLength(3)
  .setMaxLength(30)
  .setDescription(`Novo sobremim`)),
  run:async(bot,db,i)=>{
    i.reply("Manutenção").catch(()=>{})
  }
}