const { Client, Collection, Structures } = require('discord.js');
const DiscordRPC = require('discord-rpc')
const fs = require('fs')
module.exports = class extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone',
            partials: ['GUILD_MEMBER', 'MESSAGE']
        });
        this.commands = new Collection();
        this.interactions = new Collection();
        this.config = config
        this.lex = require('./messageHandler');
        this.constants = require('./constants')
        
        fs.readdir('./commands', {withFileTypes: true}, (err, files) => {
            if(err) throw err;
            const folders = files.filter(f => f.isDirectory())
            const cmdfiles = files.filter(f => f.name.endsWith('.js'))
            folders.forEach(fo => {
                fs.readdir(`./commands/${fo.name}`, (err, files) => {
                    if(err) throw err;
                    files.forEach(f => {
                        const command = require(`../commands/${fo.name}/${f}`)
                        this.commands.set(command.help.name, command)
                    })
                })
            })
            cmdfiles.forEach(f => {
                const command = require(`../commands/${f.name}`)
                this.commands.set(command.help.name, command)
            })
        })
    
        fs.readdir('./events', (err, files) => {
            if(err) throw err;
            files.forEach(f => {
                const event = require(`../events/${f}`)
                let eventName = f.split('.')[0]
                this.on(eventName, event.bind(null, this));
            })
        })

        fs.readdir('./interactions', (err, files) => {
            if (err) throw err;
            files.forEach(f => {
                const int = require(`../interactions/${f}`)
                this.interactions.set(f.split('.')[0], int)
            })
        })

        this.ws.on('INTERACTION_CREATE', interaction => {
            const intname = interaction.data.name;
            const int = this.interactions.get(intname)
        
            int(this, interaction)
        })
    }

    
    
}

Structures.extend('GuildMember', C => class extends C {
    constructor(client, data, guild) {
        super(client, data, guild)
        this.pending = data.pending ?? false
    }
})
