const fs = require('fs');
const p = require('path')
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
        const noop = () => {}
        const paths = message.client.paths
        if(message.author.id !== '372516983129767938') return;
        const c = args.single()
        const d = args.single()
        if(!c) return message.reply('You need to supply a category to reload')
        const reloadType = c ? c.toLowerCase() : null
        const reloadName = d ? d.toLowerCase() : null
        if (reloadType == 'command' && !reloadName) {
            const commands = message.client.commands
            
            for(const cmd of commands.values()) {
                    const path = paths.commands.get(cmd.help.name)
                    delete require.cache[require.resolve(path)]
            }

            try {
                message.client.loadCommands()
            } catch (e) {
                return message.reply('There was an error trying to reload all commands!')
            }
            return message.channel.send('Successfully reloaded all commands!')
        }
        if (reloadType === 'command' && reloadName) {
        const command = message.client.commands.get(reloadName)
            || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(reloadName))
        if (!command) return message.channel.send(`There is not command named \`${reloadName}\``)

        const path = paths.commands.get(command.help.name)

        delete require.cache[require.resolve(path)]

        try {
            const newCommand = require(path);
            message.client.commands.set(newCommand.help.name, newCommand);
            message.channel.send(`Successfully reloaded command \`${command.help.name}\``)
        } catch (e) {
            console.log(e);
            message.reply(`There was an error wile reload a command \`${command.help.name}\`:\n\`${e.message}\``)
        }
    }
        if (reloadType === 'events' && !reloadName) {
            for(const path in paths.events) {
                const name = p.basename(path).split('.')[0]
                delete require.cache[require.resolve(path)]
                message.client.removeListener(name, noop) 
            }

            try {
                message.client.loadEvents()
            } catch (e) {
                return message.reply('There was an error trying to reload all events!')
            }
            return message.channel.send('Successfully reloaded all events')
        }
        if(reloadType === 'events' && reloadName) {
            const path = paths.events.get(reloadName)
            if(!path) return message.reply(`There is no event with the name ${reloadName}`)

            const name = p.basename(path).split('.')[0]

            try {
                message.client.removeListener(name, noop)
                message.client.loadEvents(path)
            } catch (e) {
                return message.client.log('error', 'RELOAD_EVENT_ERR', e)
            }
            return message.reply('Event Reloaded!')
        }
    }
}