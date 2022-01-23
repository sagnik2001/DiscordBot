const { Client, Intents } = require('discord.js');
const {MessageEmbed} = require('discord.js')
const weather = require("weather-js")
const axios = require("axios")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const getQuotes = () => {
  return axios.get("https://zenquotes.io/api/random")
    .then(res => {
    
      return res.data[0]["q"] + " - " + res.data[0]["a"]
    })
}
const getWeather = (message,args)=>{
  weather.find({search: args.join(" "), degreeType: `C`}, function (error, result) {
    if(error) return message.channel.send(error)
    if(!args[0]) return message.channel.send("Please enter a valid location")
    if(result === undefined || result.length==0) return message.channel.send("**Invalid** location !!!")

    // Handling the results 


    const embed = new MessageEmbed()
    .setColor(0x111111)
    .setAuthor(`Weather forecast for ${result[0].current.observationpoint}`)
    .setThumbnail(result[0].current.imageUrl)
    .setDescription(`**${result[0].current.skytext}**`)
    .addField('Day', `${result[0].current.day}`, true)
    .addField('Date', `${result[0].current.date}`, true)
    .addField('Time', new Date().toLocaleTimeString(), true)
    .addField('TimeZone', `UTC ${result[0].location.timezone}`, true)
    .addField('Degree Type', 'Celcius', true)
    .addField('Temperature', `${result[0].current.temperature}°`, true) 
    .addField('Wind', `${result[0].current.winddisplay}`, true)
    .addField('Feels Like', `${result[0].current.feelslike}°`, true)
    .addField('Humidity', `${result[0].current.humidity}%`, true)

    message.channel.send({embeds: [embed]})
   

})
}
const getMemes = ()=>{
  return axios.get("http://meme-api.herokuapp.com/gimme/memes")
  .then(res=>{

    const embed = new MessageEmbed()
    embed.setTitle(res.data.title)
    embed.setURL(res.data.postLink)
    embed.setColor("#00ff00")
    embed.setFooter(res.data.ups + "Upvotes")
    embed.setTimestamp()
    embed.setImage(res.data.url)
    return embed
  })
}

client.on('ready', () => {
  console.log("I'm in");
  console.log(client.user.username);
});

client.on('messageCreate', (msg) => {
  // Condition to check whether its discord bot or the user
  if (msg.author.bot) return
  if (msg.content == "plsquote") {
    getQuotes().then(res => {
      msg.channel.send(res)
    })
  }
  if (msg.content == "plsmemes") {
    getMemes().then(embed => {
    
      msg.channel.send({embeds: [embed]})
    })
  }
  if(msg.content == "plshelpme"){
      const embed = new MessageEmbed()
      .setColor("#fffff0")
      .setTitle("***__COMMANDS__***")
      .setAuthor(msg.author.tag, msg.member.user.displayAvatarURL({dynamic:true}),"https://harmonymusic.tk")
      .setDescription(`
        \'plshelpme\'   ➖➖ *List of all Commands*
        \'plsquote\'    ➖➖ *Provide you with a quotes*
        \'plsmemes\'    ➖➖ *Provide you with a good meme*
        \'plsweather **location**\'   ➖➖ *Provide you with weather of the location*
        `
      )
      msg.channel.send({embeds: [embed]})

  }
  const args = msg.content.slice("plsweather").trim().split(/ +/g)
    const command = args.shift()
    if (msg.content.startsWith("plsweather")) {
      // getMemes().then(embed => {
      
      //   msg.channel.send({embeds: [embed]})
      getWeather(msg,args)
      // })
    } 
  // if (sadWords.some(word => msg.content.includes(word))) {
  //   const encourgament = encourgaments[Math.floor(Math.random() * encourgaments.length())]
  //   msg.reply(encourgament)

  // }
})


client.login("OTM0MzQ2OTQ4NDYxMzUwOTQy.YeuwZw.hkggTpCLLmvNNPeqHDCQcm62mpA");