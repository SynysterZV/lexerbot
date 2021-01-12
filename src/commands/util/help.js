const { MessageEmbed, Collection } = require('discord.js')
module.exports = {
    help: {
        name: 'help',
        desc: 'Displays this embed!',
        aliases: [],
        category: 'util',
        usage: '{ category name | command name }'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        let embed = new MessageEmbed()
        let d = args.single(); let input = d ? d.toLowerCase() : undefined

        let categories = []
        const catfolders = require('fs').readdirSync('./commands', {withFileTypes: true}).filter(dirent => dirent.isDirectory());
        catfolders.forEach(c => {
            categories.push(c.name)
        })

        const catmap = categories.slice(1).map(c => `•${c.cap()}`).join('\n')

        if (!input) {
        embed.setTitle('Help')
        embed.setFooter(message.guild, message.guild.iconURL())
        embed.setTimestamp()
        embed.addFields(
            {name: 'Categories', value: `${catmap}\n\nI.E. \`${message.client.config.prefix}help {category}\``}
        )
        } else if(categories.includes(input)) {
            const multiple = 10
            let page = args.single() ?? 1
            const array = message.client.commands.filter(c => c.help.category == input).array()
            const maxPages = Math.ceil(array.length / multiple)
            if(page < 1 || page > maxPages) return message.channel.send('That page doesnt exist');
    
            const end = page * multiple
            const start = end - multiple 
            const commands = array.slice(start, end)
    
                embed.setTitle(input || 'Help')
                embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`)
                embed.setTimestamp()
    
            for(const i in commands) {
                embed.addField(`${message.client.config.prefix}${commands[i].help.name}`, commands[i].help.desc)
            }

        } else {
            const command = message.client.commands.get(input.toLowerCase()) || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(input.toLowerCase()))
            if(!command) return message.channel.send(`There is no command named \`${input}\``)

            embed.setTitle(command.help.name)
            embed.setFooter(message.guild, message.guild.iconURL())
            embed.setTimestamp()
            embed.setDescription(command.help.desc)
            embed.addFields(
                { name: 'Category:', value: command.help.category },
                { name: 'Aliases:', value: command.help.aliases.length ? command.help.aliases : 'None' },
                { name: 'Usage', value: command.help.usage ? `\`;${command.help.usage}\`` : 'None' }
            )
        } 
        return message.client.emit('reactDelete', (await message.channel.send(embed)), message.author);
    }
}