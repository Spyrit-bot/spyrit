import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import vm from 'node:vm'
export default {
  data: new SlashCommandBuilder()
  .setName("free-eval")
  .setDescription(`Execute códigos JavaScript de graça em um ambiente limpo.`)
  .addStringOption(b=>b.setRequired(true)
  .setMaxLength(300)
  .setName("code")
  .setDescription("Código JavaScript")
  ),
  run: async(bot,db,i)=>{
    let res = ``
    let context = {
      require: function require(name){
        /**
         * Oq vamos fazer?
         * Um erro para não usarem require
         * mas não vai poder importar nada?
         * não man, já disse isso
         */
        throw new Error("Não é possível usar require dentro de um ambiente freeEval.")
      },
      fetch: function fetch(name){
        // Github, gera um código que dá erro que fala: Não é possível usar fetch dentro de um ambiente freeEval.
        throw new Error("Não é possível usar fetch dentro de um ambiente freeEval.")
      },
      console:{
        log: function log(log){
          // Se tá lendo isso, você é uma SAFADA!
          if(typeof log === "object") res+=`${JSON.stringify(log,0,1)}`
          else res+=`${log}\n`
          return undefined;
        },
        warn: function warn(log){
          // Se tá lendo isso, você é uma SAFADA!
          if(typeof log === "object") res+=`${JSON.stringify(log,0,1)}`
          else res+=`${log}\n`
          return undefined;
        },
        error: function error(log){
          // Se tá lendo isso, você é uma SAFADA!
          if(typeof log === "object") res+=`${JSON.stringify(log,0,1)}`
          else res+=`${log}\n`
          return undefined;
        },
        info: function info(log){
          // Se tá lendo isso, você é uma SAFADA!
          if(typeof log === "object") res+=`${JSON.stringify(log,0,1)}`
          else res+=`${log}\n`
          return undefined;
        },
        
      }
    }
      
      vm.createContext(context)
      const code = i.options.getString("code")
      try{
      let mnnn = await vm.runInContext(code,context)
      
        i.reply({
          embeds:[
            new EmbedBuilder()
            .setTitle("FreeEval")
            .setDescription(`Resultado:\n\`\`\`js\n${res}\n\`\`\``)
            .setColor("#00ff00")
            ]
        }).catch(()=>{})
      }catch(e){
        i.reply({
          embeds:[
            new EmbedBuilder()
            .setTitle("FreeEval erro")
            .setDescription(`Erro:\n\`\`\`js\n${e}\n\`\`\``)
            .setColor("#ff0000")
            ]
        }).catch(()=>{})
      }
    }
  }
