
module.exports = {
    help: {
        name: 'reload',
        desc: 'Reloads a command',
        aliases: [],
        category: 'admin',
        usage: '{ command }'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        if(message.author.id !== '372516983129767938') return;
        const c = args.single()
        const commandName = c ? c.toLowerCase() : undefined
        if (!commandName) {
            const commands = message.client.commands
            
            for(const cmd of commands.values()) {
                if(cmd.help.name !== 'reload') {
                    delete require.cache[require.resolve(`../${cmd.help.category}/${cmd.help.name}.js`)]

                    try {
                        const newCommand = require(`../${cmd.help.category}/${cmd.help.name}.js`)
                        message.client.commands.set(newCommand.help.name, newCommand);
                    } catch (e) {
                        console.log(e)
                        return message.reply(`There was an error wile reload a command \`${cmd.help.name}\`:\n\`${e.message}\``)
                    }
                }
                return message.channel.send('Successfully reloaded all commands!')
            }
        }

        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName))
        if (!command) return message.channel.send(`There is not command named \`${commandName}\``)

        delete require.cache[require.resolve(`../${command.help.category}/${command.help.name}.js`)]

        try {
            const newCommand = require(`../${command.help.category}/${command.help.name}.js`);
            message.client.commands.set(newCommand.help.name, newCommand);
            message.channel.send(`Successfully reloaded command \`${command.help.name}\``)
        } catch (e) {
            console.log(e);
            message.reply(`There was an error wile reload a command \`${command.help.name}\`:\n\`${e.message}\``)
        }
    }
}