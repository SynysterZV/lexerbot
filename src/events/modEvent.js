const { MessageEmbed } = require('discord.js')
module.exports = async (client, action, data) => {

    const eventColors = client.constants.eventColors

    const guild = data.guild || data.member.guild 
    const modChannel = guild.channels.cache.find(c => c.name == client.config.mod.channel)
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

    if(data.time) {
        embed.description += `\n**Time:** \`${data.time}\``
    }

    if(data.days) {
        embed.description += `\n**Days:** \`${data.days} day(s)\``
    }


    client.log('error', action, `User: ${user.tag}(${user.id}) Reason: ${data.reason || 'No Reason'}`)
    modChannel.send(embed)
}