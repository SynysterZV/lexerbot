const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'howto',
        desc: 'How to use me',
        aliases: ['how'],
        category: 'info'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        const embed = new MessageEmbed()
            .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
            .setTitle('How to use me!')
            .setDescription(`My commands are parsed using a module called \`Lexure\`, and using lexure, lots of my options or flags for commands are parsed peticularly.\n\n•Any OPTION (requires input), will use \`--option=value\`\n\n•Any FLAG (not requirng input, a toggle), will use \`--flag\`\n\nEX: \`${message.client.config.prefix}translate word --to=russian\``)
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        message.channel.send(embed)
    }
}