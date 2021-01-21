const { MessageEmbed } = require('discord.js')
const { Sequelize , DataTypes } = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
})

const modEvents = require('../structures/modEvents')(sequelize, DataTypes)

module.exports = async (client, action, data) => {

    const eventColors = client.constants.eventColors

    const guild = data.guild || data.member.guild 
    const modChannel = guild.channels.cache.find(c => c.name == client.config.mod.channel || c.name == 'testing')
    if(!modChannel) return;
    const user = data.user || data.member.user

    const embed = new MessageEmbed()
            .setAuthor(data.executor.tag, data.executor.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`**Member:** \`${user.tag}\`(${user.id})\n**Action:** ${action.toLowerCase().cap()}`)
            .setTimestamp()
            .setColor(eventColors[action])

    if(data.reason) {
        embed.description += `\n**Reason:** ${data.reason}`
    }

    if(data.context) {
        embed.description += `\n**Context:** [Here](${data.context})`
    }

    if(data.time) {
        embed.description += `\n**Time:** \`${data.time}\``
    }

    if(data.days) {
        embed.description += `\n**Days:** \`${data.days} day(s)\``
    }
    
    const modaction = `${action.toLowerCase()}s`
    const modEventLog = await modEvents.findOne({ where: { userid: user.id, guildid: guild.id }})
    console.log(modEventLog[modaction])

    if(!modEventLog) {
        modEvents.create({
            userid: user.id,
            guildid: guild.id,
            warns: 0,
            bans: 0,
            mutes: 0,
            kicks: 0
        })
    }
    
    modEventLog[modaction] += 1

  

    modEvents.sync()


    client.log('error', action, `User: ${user.tag}(${user.id}) Reason: ${data.reason || 'No Reason'}`)
    modChannel.send(embed)
}