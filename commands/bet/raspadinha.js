import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js'

export default {
  data: new SlashCommandBuilder()
  .setName("raspadinha")
  .setDescription("Comandos da raspadinha")
  .addSubcommand(b=>
  b.setName("info")
  .setDescription(`Veja as informações da raspadinha`))
  .addSubcommand(b=>
  b.setName("status")
  .setDescription(`Veja os seus status da raspadinha`))
  
  .addSubcommand(b=>
  b.setName("comprar")
  .setDescription(`Compre uma raspadinha por ${process.formatar(200)}.`)),
  run: async(bot,db,i)=>{
    const usrmodel = db.model("user")
    const transmodel = db.model("transactions")
    let usr = await usrmodel.findOne({ _id: i.user.id })
   
    let cats = {
      "1":"1169323537518047392",
      "2":"1169323554752450590",
      "3":"1169323572305592382",
      "4":"1169323591893004308",
      "5":"1169323623425777724",
      "6":"1169323645261320232",
      "7":"1169323664102133821",
      "8":"1169376126557237278"
    }
    let catswin = {
      "1":120,
      "2":210,
      "3":330,
      "4":400,
      "5":1700,
      "6":2000,
      "7":10000,
      "8":100000
    }
    let subcmd = i.options.getSubcommand()
    if(subcmd === "comprar"){
      if(usr?.economy?.bank < 200) return i.reply({ content: `Você não tem dinheiro no banco para comprar a raspadinha, você não esqueceu de depositar seu saldo com /banco depositar?`}).catch(()=>{})
      let trans = new transmodel({
        userid: i.user.id,
        type:4,
        value:-200,
        timestamp: Date.now()
      })
      usr.economy.bank -= 200;
      await usr.save();
      await trans.save();
    let win = 0
    let res = [
      [random(),random(),random()],
      [random(),random(),random()],
      [random(),random(),random()]
      
      ]
      
      let getted = [
        false,false,false,
        false,false,false,
        false,false,false
        
        ]
        let comb = [ false, false, false, false, false, false, false, false, false]
        let winx = [ false, false, false, false, false, false, false, false, false]
        
    function notgetbtn(id,d,e){
      let em = "";
      if(!getted[id-1]) return new ButtonBuilder()
         .setStyle(ButtonStyle.Primary)
         .setEmoji(`❔`)
         .setCustomId(`${id}`)
         .setDisabled(false)
      if(id <= 3) em=cats[`${res[0][id-1]}`]
      else if(id <= 6) em=cats[`${res[1][id-4]}`]
      else if(id <= 9) em=cats[`${res[2][id-7]}`]
     
      
      return new ButtonBuilder()
         .setStyle(e ? winx[id-1] ? ButtonStyle.Success : ButtonStyle.Danger : ButtonStyle.Secondary)
         .setEmoji(em)
         .setCustomId(`${id}`)
         .setDisabled(false)
    }
    function view(d,s){
     return [
       new ActionRowBuilder()
       .addComponents(
         notgetbtn(1,d,s),
         notgetbtn(2,d,s),
         notgetbtn(3,d,s)
         ),
         new ActionRowBuilder()
       .addComponents(
         notgetbtn(4,d,s),
         notgetbtn(5,d,s),
         notgetbtn(6,d,s)
         ),
         new ActionRowBuilder()
       .addComponents(
         notgetbtn(7,d,s),
         notgetbtn(8,d,s),
         notgetbtn(9,d,s)
         ),
         ]
    }
    let r = await i.reply({ components: view() }).catch(()=>{})
    if(r){
     let com = r.createMessageComponentCollector({
       filter:(e)=>{
         if(e.user.id != i.user.id) e.reply({ content: `Epa, você não é ${i.user}!`, ephemeral:true}).catch(()=>{})
         return e.user.id === i.user.id
         },
       time: 3_600_000
     })
     let end = false
     com.on("collect",async m=>{
       
       let id = +m.customId;
       if(isNaN(Number(id))) return
       if(end) return m.reply({ content: `Essa raspadinha já foi pega!`,ephemeral:true}).catch(()=>{});
       getted[id-1] = true;
       
       let fltr = getted.filter(e=>!e).map(t=>true)
       
       if(!fltr[0]){
         end=true
         usr = await usrmodel.findOne({ _id: i.user.id })
         // Lateral
         if(res[0][0] === res[0][1] && res[0][0] === res[0][2]){
           winx[0] = true;
           winx[1] = true;
           winx[2] = true;
           
           win+=catswin[res[0][0]]
         }
         if(res[1][0] === res[1][1] && res[1][0] === res[1][2]){
           winx[3] = true;
           winx[4] = true;
           winx[5] = true;
           
           win+=catswin[res[1][0]]
         }
         if(res[2][0] === res[2][1] && res[2][2] === res[2][1]){
           winx[6] = true;
           winx[7] = true;
           winx[8] = true;
           
           win+=catswin[res[2][0]]
         }
         
         // Horizonal
         if(res[0][0] === res[1][0] && res[2][0] === res[0][0]){
           winx[0] = true;
           winx[3] = true;
           winx[6] = true;
           
           win+=catswin[res[0][0]]
         }
         if(res[0][1] === res[1][1] && res[2][1] === res[0][1]){
           winx[1] = true;
           winx[4] = true;
           winx[7] = true;
           
           win+=catswin[res[0][1]]
         }
         if(res[0][2] === res[1][2] && res[2][2] === res[0][2]){
           winx[2] = true;
           winx[5] = true;
           winx[8] = true;
           
           win+=catswin[res[0][0]]
         }
         
         // Vertical
         if(res[0][0] === res[1][1] && res[2][2] === res[0][0]) {
           winx[0] = true;
           winx[4] = true;
           winx[8] = true;
           
           win+=catswin[res[0][0]]
         }
         if(res[0][2] === res[1][1] && res[2][0] === res[0][2]){
           winx[2] = true;
           winx[4] = true;
           winx[6] = true;
           
           win+=catswin[res[0][2]]
         }
         
        
         
         usr.economy.bank+=win;
         if(win===0){
           usr.economy.raspadinha.perdeu+=200;
           usr.economy.raspadinha.jogos++;
           usr.economy.raspadinha.perdas++;
           
         }else{
           usr.economy.raspadinha.ganhou+=win;
           usr.economy.raspadinha.jogos++;
           usr.economy.raspadinha.ganhos++;
           
         }
         if(win != 0){
           trans.value+=win;
           await trans.save()
         }
         await usr.save()
         await m.update({
           content: win === 0 ? `${m.user}, Você não ganhou nada nessa raspadinha, seja forte, na próxima pode ganhar!` : win < 200 ? `${m.user} você perdeu ${process.formatar((win-200)*-1)} nessa raspadinha` : `${m.user}, Com sucesso você ganhou ${process.formatar(win-200)} na raspadinha!\nO valor já foi depositado em sua conta bancária.`,
           
           components: view(true,true)
         }).catch(()=>{})
         
         
         return
       }
       m.update({
         components: view()
       }).catch(()=>{})
     })
    }
    
    function random(){
      let n = Math.floor(Math.random() * 100);
      if(n < 15) return 1;
      if(n < 37) return 2;
      if(n < 49) return 3;
      if(n < 52) return 4;
      if(n < 76) return 5;
      if(n < 80) return 6;
      if(n < 97) return 7;
      return 8
    }
    }else if(subcmd === "status"){
      let {ganhos,ganhou,jogos,perdas,perdeu} = usr.economy.raspadinha;
      let porg = +((ganhos/jogos)*100).toFixed(2)
      let porp = +((perdas/jogos)*100).toFixed(2)
      let porg1 = +((ganhou/(ganhou+perdeu))*100).toFixed(2)
      let porp1 = +((perdeu/(ganhou+perdeu))*100).toFixed(2)
      
      if(isNaN(porg)) porg=0;
      if(isNaN(porp)) porp=0;
      if(isNaN(porg1)) porg1=0;
      if(isNaN(porp1)) porp1=0;
      
      let emb = new EmbedBuilder()
      .setTitle("Status Raspadinha")
      .setColor("#ffffff")
      .setTitle(`Raspadinhas`)
      .setDescription(`**            **Ganhos\nGanhos: ${process.formatar(ganhos,true)} (${porg}%)\nGanhou: ${process.formatar(ganhou)} (${porg1}%)\n\n**            **Perdas\nPerdas: ${process.formatar(perdas,true)} (${porp}%)\nPerdeu: ${process.formatar(perdeu)} (${porp1}%)\n\n**            **Geral\nJogos jogados: ${process.formatar(jogos,true)}`)
      
      i.reply({ embeds: [emb]}).catch(()=>{})
      //{ ganhos: 8, ganhou: 4500, jogos: 19, perdas: 11, perdeu: 2200 }
      }else{
      let bas = `%a vale %b`
      let m = Object.keys(cats).map(n=>{
        return bas.replace("%a",`${bot.emojis.cache.get(cats[n])}`).replace("%b",process.formatar(catswin[n]))
      }).join("\n")
      i.reply({
        content:`## **     ** Ganhos das raspadinhas\n\n${m}`
      }).catch(()=>{})
    }
  }
}