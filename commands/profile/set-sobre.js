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
    let userdb = db.model("user")
    
    let usr = await userdb.findOneAndUpdate({ _id: i.user.id }, {}, { upsert: true })
    
    let newabout = i.options.getString("texto");
    
    usr.bot.profile.aboutme = newabout;
    await usr.save()
    i.reply("Seu sobremim foi editado com sucesso.").catch(()=>{})
  },
  msgrun:async(bot,db,i,args)=>{
    let userdb = db.model("user")
    
    let usr = await userdb.findOneAndUpdate({ _id: i.author.id }, {}, { upsert: true })
    
    let newabout = args.join(" ")
    if(!args[0]) return i.reply(`Use \`${process.env.prefixo}sobre <novo sobremim>\`.`).catch(()=>{})
    if(newabout.length < 3 || newabout.length > 30) return i.reply("O sobre precisa ter entre 3 e 30 caracteres.").catch(()=>{})
    
    usr.bot.profile.aboutme = newabout;
    await usr.save()
    i.reply("Seu sobremim foi editado com sucesso.").catch(()=>{})
  },
  
}