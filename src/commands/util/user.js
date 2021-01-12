const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'user',
        desc: 'Display User info',
        aliases: [],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        const roles = message.member.roles.cache.sort((a,b) => b.position - a.position).map(r=> `\`${r.name}\``).join(', ')
        const joinedTime = new Date(message.member.joinedAt).toDateString()
        const createdTime = new Date(message.author.createdAt).toDateString()
        const embed = new MessageEmbed()
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(`Requested by ${message.member.nickname || message.author.username}`)
            .addFields(
                { name: '❯ Member Details', value: `• Nickname: \`${message.member.nickname || 'None'}\`\n• Roles: ${roles}\n• Joined: \`${joinedTime}\`\n• Activity: \`${message.member.presence.activities[0].name}\``},
                { name: '❯ User Details', value: `• ID: \`${message.author.id}\`\n• Username: \`${message.author.tag}\`\n• Created: \`${createdTime}\`\n• Status: \`${message.author.presence.status}\``}
            )

        message.channel.send(embed)
    }
}