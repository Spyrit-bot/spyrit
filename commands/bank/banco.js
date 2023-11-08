import {SlashCommandBuilder, EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js';
export default {
  data: new SlashCommandBuilder()
  .setName("bank")
  .setNameLocalization("pt-BR","banco")
  .addSubcommand(k=>k
  .setName("bal")
  .setNameLocalization("pt-BR","saldo")
  .setDescription("Veja o saldo")
  .addUserOption(k=>
    k.setName("user")
    .setNameLocalization("pt-BR","usuário")
    .setDescription("Usuário que deseja ver saldo")
    .setRequired(false))
  )
  .addSubcommand(k=>k
  .setName("with")
  .setNameLocalization("pt-BR","sacar")
  .setDescription("Saque seu saldo")
  .addStringOption(e=>
    e.setRequired(true)
    .setName("valor")
   .setAutocomplete(true)
    .setDescription(`Qual o valor que deseja sacar?`))
  )
  .addSubcommand(k=>k
  .setName("dep")
  .setNameLocalization("pt-BR","depositar")
  .setDescription("Deposite seu saldo")
  .addStringOption(e=>
    e.setRequired(true)
   .setAutocomplete(true).setName("valor")
    .setDescription(`Qual o valor que deseja depositar?`))
  )
  .addSubcommand(k=>k
  .setName("lb")
  .setNameLocalization("pt-BR","placar")
  .setDescription("Veja os mais ricos no banco")
  .addNumberOption(n=>{
    n.setName("page")
    .setDescription("Página")
    .setMinValue(1)
    .setMaxValue(10)
    return n
   
  })
  )
  
  
  .setDescription(`Comandos do banco`),
  run: async(bot,db,i)=>{
    let userModel = db.model("user")
    let subcommand = i.options.getSubcommand()
    if(subcommand === "bal"){
      let user = i.options.getUser('user') || i.user;
 
       let query = { _id: user.id };let update = {};let options = {upsert: true, new: true, setDefaultsOnInsert: true};
let userdb = await userModel.findOneAndUpdate(query, update, options);
 
 if(userdb?.bot?.blocklist?.ative) return i.reply({
   content:`Não é possível ver o saldo de uma pessoa bloqueada em meu sistema.`
 }).catch(()=>{})
 let usersdb = await userModel.find({ sim:true });
 let top = 0;
 usersdb=usersdb.filter(m=>m.economy.bal != Infinity)
 usersdb.sort((a,b)=>{
      return b.economy.bank - a.economy.bank
    })
 usersdb.forEach((v,ind)=>{
   
   if(v._id === user.id) top=ind+1
 })
 let dmsg = ""
 
 let data = new Date()
 let dia = +data.getDate()
 let mes = +data.getMonth()
 let ano = +data.getFullYear()
 
 
    i.reply({
      content:user.id === i.user.id ? `O seu saldo no banco é de ${process.formatar(+userdb.economy.bank.toFixed(2))} e você está no top #${top} do ranking.` : `O saldo do banco de ${user} é ${process.formatar(+userdb.economy.bank.toFixed(2))} e ele está no top #${top} do ranking.`,
      allowMentions:{parse:[]}
    }).catch(()=>{})
    }
    if(subcommand === "with"){
      let valor = i.options.getString("valor")
    
    let usr = await userModel.findOne({ _id: i.user.id })
    
    if(valor.toLowerCase() === "all") valor = usr.economy.bank
    
    if(isNaN(+valor)) return i.reply({ content: "Defina o valor como um número ou all para tudo!"}).catch(()=>{})
    valor=Number(valor)
    if(valor < 45) return i.reply("Lembre-se que para sacar, você precisa adicionar um valor igual ou maior que 45!").catch(()=>{})
    if(usr.economy.bank < valor) return i.reply({ content: `Você não tem esse valor no banco, lhe falta ${process.formatar(valor-usr.economy.bank)}.`}).catch(()=>{})
    usr.economy.bank-=valor;
    usr.economy.bal+=valor;
    await usr.save();
    return await i.reply({ content: `Você sacou com sucesso ${process.formatar(valor)} em sua conta bancária! Agora você tem ${process.formatar(usr.economy.bal)} no saldo e ${process.formatar(usr.economy.bank)} no banco!` }).catch(()=>{})
    }
    if(subcommand === "dep"){
      let valor = i.options.getString("valor")
    let usr = await userModel.findOne({ _id: i.user.id })
    if(valor.toLowerCase() === "all") valor = usr.economy.bal
    
    if(isNaN(+valor)) return i.reply({ content: "Defina o valor como um número ou all para tudo!"}).catch(()=>{})
    valor=Number(valor)
    if(valor < 45) return i.reply("Lembre-se que para depositar, você precisa adicionar um valor igual ou maior que 45!").catch(()=>{})
    if(usr.economy.bal < valor) return i.reply({ content: `Você não tem esse valor, lhe falta ${process.formatar(valor-usr.economy.bal)}.`}).catch(()=>{})
    usr.economy.bank+=valor;
    usr.economy.bal-=valor;
    await usr.save();
    return await i.reply({ content: `Você depositou com sucesso ${process.formatar(valor)} em sua conta bancária! Agora você tem ${process.formatar(usr.economy.bal)} no saldo e ${process.formatar(usr.economy.bank)} no banco!` }).catch(()=>{})
    }
    if(subcommand === "lb"){

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
      return b.economy.bank - a.economy.bank
    })
    usersdb=usersdb.filter(b=>b.economy.bank != Infinity)
    //let usersdb1 =usersdb.slice(0,10)
    let n = 0
    let t = 0;
    usersdb.map((b)=>t+=b.economy.bank)
    let msgs = ``
    let users = usersdb.map(u=>{
    n++
    let musr = bot.users.cache.get(u._id)
    let por = ((u.economy.bank/t)*100)
    if(isNaN(por)) por=0
    return `${{ 1: "🥇", 2: "🥈", 3: "🥉"}[n] || `${n}.  `} [${musr?.globalName || musr?.tag}](https://spyrit.squareweb.app/user/${u.id}) - ${process.formatar(u.economy.bank)} - ${por.toFixed(2)}%`
    })
    let embed = new EmbedBuilder()
    .setTitle(`Leaderboard Bank - Página ${page}`)
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
  },
}