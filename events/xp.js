let cooldown = new Set()
export default {
  name:"messageCreate",
  run: async (bot,db,m)=>{
    if(m.author.bot) return
    if(cooldown.has(m.author.id)) return;
    cooldown.add(m.author.id);
    setTimeout(()=>{
      cooldown.delete(m.author.id)
    },5000);
    let xpModel = db.model("xp");
    let usrxp = await xpModel.findOne({ userid: m.author.id, guildid: m.guild.id})
    if(usrxp){
      usrxp.xp += (m.content.length/3.8)*usrxp.boost
     if(usrxp.level*1500 < usrxp.xp){
       m.reply({ content: `Parabéns, você chegou ao level ${usrxp.level+1}!`}).catch(()=>{})
       usrxp.level++;
       usrxp.xp = 0;
    }
    usrxp.save()
  }else{
    usrxp = new xpModel({
        userid:m.author.id,
        guildid:m.guild.id
        
      })
      usrxp.save()
  }
}
}