const { MessageEmbed } = require('discord.js')

module.exports = async (client, action, data) => {
    const guild = data.member.guild
    const modChannel = guild.channels.cache.find(c => c.name == 'mod-log')
    if(!modChannel) return;
    const user = data.member.user

    if(action == 'BAN') {
        const embed = new MessageEmbed()
            .setAuthor(data.executor.tag, data.executor.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`**Member:** \`${user.tag}\`(${user.id})\n**Action:** Ban\n**Reason:** ${data.reason}`)
            .setTimestamp()
            .setColor('RED')
        
            modChannel.send(embed)
    }
    if(action == 'KICK') {
        const embed = new MessageEmbed()
            .setAuthor(data.executor.tag, data.executor.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`**Member:** \`${user.tag}\`(${user.id})\n**Action:** Kick\n**Reason:** ${data.reason}`)
            .setTimestamp()
            .setColor('ORANGE')
        
            modChannel.send(embed);
    }
}