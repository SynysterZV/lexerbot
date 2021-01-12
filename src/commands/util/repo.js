const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'repo',
        desc: 'Displays this bots GitHub repo',
        aliases: ['github', 'git'],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        const embed = new MessageEmbed()
            .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
            .setColor(0xff0000)
            .setTitle('GitHub Repositories')
            .setThumbnail(message.client.user.displayAvatarURL())
            .setDescription('This is the repository for the JavaScript source code of this bot.')
            .addFields(
                { name: 'Master Repository', value: 'https://github.com/SynysterZV/lexerbot'},
            )
            .setFooter('LexerBot')
            .setTimestamp();
        message.channel.send(embed);
    }
}