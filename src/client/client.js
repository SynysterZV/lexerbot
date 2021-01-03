const { Client, Collection } = require('discord.js');
const fs = require('fs')
module.exports = class extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone',
            partials: ['GUILD_MEMBER', 'MESSAGE']
        });
        this.commands = new Collection();
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
    }
}