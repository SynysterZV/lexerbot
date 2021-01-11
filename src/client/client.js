const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const lexure = require('lexure')
module.exports = class extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone',
            partials: ['GUILD_MEMBER', 'MESSAGE'],
            presence: config.presence,
            http: {
                version: 8
            }
        });



        this.commands = new Collection();
        this.interactions = new Collection();
        this.config = config
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

        this.lex = async (message) => {
                // LEXER
            const lexer = new lexure.Lexer(message.content)
                .setQuotes([
                    ["'", "'"],
                    ['"', '"']
                ]);
            const res = lexer.lexCommand(s => s.startsWith(this.config.prefix) ? 1 : null)
            if (res == null) {
                if(message.channel.type != 'dm' || message.author.bot) return
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle('DM')
                    .setDescription(message.content)
                    .setTimestamp()
                return (await message.client.fetchApplication()).owner.send(embed).catch(e => {})
            }

            const cmd = message.client.commands.get(res[0].value)
                || message.client.commands.find(a => a.help.aliases && a.help.aliases.includes(res[0].value))
            if(!cmd) return;

            const tokens = res[1]();
            const parser = new lexure.Parser(tokens).setUnorderedStrategy(lexure.longStrategy());
            const out = parser.parse();
            const args = new lexure.Args(out)

            //PERMISSIONS HANDLER
            if(cmd.config.perms && !message.member.permissions.has(cmd.config.perms)) return message.channel.send('You dont have the permissions to use this command!');
            if (cmd.config.role && !message.member.roles.cache.some(role => role.name === cmd.config.role)) return message.channel.send('You dont have the role to use this command!')
            return {cmd, args}
        }
    }

    
    
}



