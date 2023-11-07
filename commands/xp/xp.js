import {
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
  .setName("xp")
  . setDescription("Comandos de xp")
  .addSubcommand(b=>b
  .setName("view")
  .setNameLocalization("pt-BR","ver")
  .setDescription("See your or someone else's xp")
  .setDescriptionLocalization("pt-BR","Veja o seu xp ou de alguém")
  .addUserOption(b=>
  b.setName("user")
  .setDescription("The user who wants to see xp")
  .setNameLocalization("pt-BR","usuário")
  .setDescriptionLocalization("pt-BR","O usuário que deseja ver o xp"))
  ),
  run: async(bot,db,i)=>{
    let xpGuild = db.model("xp")
    let subcmd = i.options.getSubcommand();
    if(subcmd === "view"){
      let user = i.options.getUser("user") || i.user;
      let iud = user.id === i.user.id;
      let {xp,level,boost} = await xpGuild.findOneAndUpdate({ userid: user.id, guildid: i.guild.id },{},{ upsert: true })
      /*
       {
  userid: '1046844921530818630',
  guildid: '1169276818445062285',
  xp: 49.75,
  level: 2,
  boost: 1
      }
      */
       let emb = new EmbedBuilder()
       .setTitle(`${iud ? "Seu XP" : `XP de ${user.tag}`}`)
       .setDescription(`Level: ${level}\nXP: ${xp.toFixed(0)}/${level*1500}`)
       .setColor("#ffffff")
       i.reply({
         content:`${i.user}`,
         
         embeds:[
           emb
         ]
       }).catch(()=>{})
    }
  }
}
