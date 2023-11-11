import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
export default {
  data: new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Veja o avatar")
  .addUserOption(e=>e.setName("user").setDescription("Usuário")),
  run: async (bot, db, i)=>{
    let usr = i.options.getUser("user") || i.user;
    let ius = usr.id === i.user.id;
    i.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle(ius ? `Seu avatar` : `Avatar de ${usr.tag}`)
        .setImage(usr.avatarURL({ size: 4096, format: `PNG`}))
        .setFooter({
          text: ius ? `Ainda é seu avatar` : `Ainda é o avatar de ${usr.tag}`
        })
        .setColor("#ffffff")
        ],
        components:[
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Abrir no navegador`)
            .setURL(usr.avatarURL({ size: 4096, format: `PNG`}))
            )
          ]
    }).catch(()=>{})
  }
}