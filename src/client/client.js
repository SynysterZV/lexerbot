const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const lexure = require('lexure')
const { Manager } = require('erela.js')
const Spotify = require('erela.js-spotify')

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
        if(!config) throw new Error('You must supply a config file!');

    /*
    *
    * ENVIRONMENT
    * SETTING
    * 
    */

       this.commands = new Collection();
        this.interactions = new Collection();
        this.config = config
        this.token = config.keyring.discord
        this.constants = require('./constants')

        if(!config.keyring.discord) throw new Error('You need a bot token to use the bot!')

 

    /*
    * 
    * COMMAND
    * LOADER
    * 
    */
        
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

    /*
    *
    * LEXURE
    * ARGUMENT
    * PARSING
    *
    */

        this.lex = async (message) => {
                // LEXER
            const lexer = new lexure.Lexer(message.content)
                .setQuotes([
                    ["'", "'"],
                    ['"', '"']
                ]);
            const regx = new RegExp(`^<@!?${this.user.id}>`);
            const res = lexer.lexCommand(s => regx.test(s) ? 22 : s.startsWith(';') ? 1 : null)
            if (res == null) {
                if(message.author.bot) return


                if(message.channel.type === 'dm') {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle('DM')
                    .setDescription(message.content)
                    .setTimestamp()
                return (await message.client.fetchApplication()).owner.send(embed).catch(e => {})
                }
                if(regx.test(message.cotent) || message.content.startsWith(';')) {
                const embed = new MessageEmbed()
                .setAuthor(this.user.tag, this.user.displayAvatarURL())
                .setDescription('You can use `;help` to view a list of my commands!')
                return message.channel.send(embed)
                }
                return;
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
            message.delete();
            return {cmd, args}
        }

    /*
    *
    * ERELA.JS
    * MUSIC
    * MANAGER
    * 
    */

        this.manager = new Manager({
            plugins: [
                new Spotify({
                    clientID: config.keyring.spotify.id,
                    clientSecret: config.keyring.spotify.secret
                })
            ],
            send: (id, payload) => {
                const guild = this.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
          })
          .on('nodeConnect', node => console.log("\x1b[36m",`Node ${node.options.identifier} connected`,"\x1b[0m"))
          .on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} has had an error ${error}`))
          .on('trackStart', (player, track) => {
            const guild = this.guilds.cache.get(player.guild);
            const req = guild.member(track.requester);
            const embed = new MessageEmbed()
                .setTitle('» Now Playing: ')
                .setDescription(`[${track.title}](${track.uri})`)
                .setAuthor(req.user.tag, req.user.displayAvatarURL())
                .setFooter(guild, guild.iconURL())
                .setTimestamp()
                .setThumbnail(track.thumbnail);
            if(track.uri !== 'https://www.youtube.com/watch?v=Q-tH0olciZU') {
            this.channels.cache.get(player.textChannel).send(embed).then(m => m.delete({ timeout: 10000 }));
          }
          else {return;}
          })
          .on('queueEnd', (player) => {
            this.channels.cache
                .get (player.textChannel)
                .send('Queue has ended.');
          
            player.destroy();
          })
          .on('playerMove', (player, currentChannel, newChannel) => {
            player.voiceChannel = this.channels.cache.get(newChannel);
          });
          
          this.on('raw', (d) => this.manager.updateVoiceState(d));
    }   
}