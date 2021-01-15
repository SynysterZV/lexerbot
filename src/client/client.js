const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const lexure = require('lexure')
const { Manager } = require('erela.js')
const Spotify = require('erela.js-spotify')
const chalk = require('chalk');
const moment = require('moment');
const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format

const toUpper = string => string.charAt(0).toUpperCase() + string.slice(1);

const Keyv = require('keyv')

const prefixes = new Keyv('sqlite://database.sqlite')

class LexClient extends Client {
    constructor(config) {
        super({
            disableMentions: 'everyone',
            partials: ['GUILD_MEMBER', 'MESSAGE'],
        });


    /*
    *
    * LOGGER
    * SETTINGS
    * 
    */

        const levels = { 
            success: chalk.green,
            error: chalk.red,
            warn: chalk.yellow,
            info: chalk.blue,
            debug: chalk.magenta,
        };


        const form = printf(({ level, message, label }) => {
            const style = levels[level]
            return `${style.bold(`[${moment().format('HH:mm:ss')} ${toUpper(label)}]`)} ${style(`${message}`)}`
        })

        const simpleform = printf(({ level, message, label }) => {
            return `[${moment().format('HH:mm:ss')} ${toUpper(label)}] ${message}`
        })

        const logger = createLogger({
            levels,
            transports: [
                new transports.Console(),
            ]
        })

        const fileLogger = createLogger({
            levels,
            transports: [
                new transports.File({ filename: 'lex.log' })
            ]
        })


        this.log = (level, name, message, filelog) => {
            if(typeof message !== 'string') message = require('util').inspect(message)
            logger.format = combine(
                label({ label: name }),
                form
            )

            logger.log(
                level,
                message,
            )
            if(!filelog && level != 'error') return;
            fileLogger.format = combine(
                label({ label: name }),
                simpleform
            )
            fileLogger.log(
                level,
                message
            )
        }

        if(!config) throw this.log('error', 'NO_CONFIG', 'You must supply a config file!');
        if(!config.keyring.discord) throw this.log('error', 'NO_BOT_TOKEN', 'You need a bot token to use the bot!')





    /*
    *
    * ENVIRONMENT
    * SETTING
    * 
    */  
 

       this.commands = new Collection();
        this.interactions = new Collection();
        this.muted = new Collection();
        this.config = config
        this.token = config.keyring.discord
        this.constants = require('./constants')
        this.prefixes = prefixes


    /*
    * 
    * COMMAND
    * LOADER
    * 
    */
        
        fs.readdir('./commands', {withFileTypes: true}, (err, files) => {
            if(err) throw this.log('error', 'ERR_COMMAND_ROOT', err);
            const folders = files.filter(f => f.isDirectory())
            const cmdfiles = files.filter(f => f.name.endsWith('.js'))
            folders.forEach(fo => {
                fs.readdir(`./commands/${fo.name}`, (err, files) => {
                    if(err) throw this.log('error', 'ERR_COMMAND_SUBDIRS', err);
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
            if(err) throw this.log('error', 'ERR_EVENTS', err);
            files.forEach(f => {
                const event = require(`../events/${f}`)
                let eventName = f.split('.')[0]
                this.on(eventName, event.bind(null, this));
                delete require.cache[require.resolve(`../events/${f}`)]
            })
        })

        fs.readdir('./interactions', (err, files) => {
            if (err) throw this.log('error', 'ERR_INTERACTIONS', err);
            files.forEach(f => {
                const int = require(`../interactions/${f}`)
                this.interactions.set(f.split('.')[0], int)
            })
        })

        this.ws.on('INTERACTION_CREATE', interaction => {
            const intname = interaction.data.name;
            const int = this.interactions.get(intname)

            this.log('warn', 'SLASH COMMAND', `<${interaction.member.user.username}>: ${intname}`)
        
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
            const guildPref = await prefixes.get(message.guild.id)
            const res = lexer.lexCommand(s => regx.test(s) ? 22 : s.startsWith(config.prefix) ? config.prefix.length : s.startsWith(guildPref) ? guildPref.length : null)
            if (res == null) {
                if(message.author == null) return
                if(message.author.bot) return


                if(message.channel.type === 'dm') {
                const embed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle('DM')
                    .setDescription(message.content)
                    .setTimestamp()
                return (await message.client.fetchApplication()).owner.send(embed).catch(e => {})
                }
                if(regx.test(message.cotent) || message.content.startsWith(config.prefix) || message.content.startsWith(guildPref)) {
                const embed = new MessageEmbed()
                .setAuthor(this.user.tag, this.user.displayAvatarURL())
                .setDescription(`You can use \`${guildPref || config.prefix}help\` to view a list of my commands!`)
                const mes = await message.channel.send(embed)
                return setTimeout(() => {
                    mes.delete()
                }, 5000)
                }
                return;
            }

            if(regx.test(message.content) && message.mentions.users.first().id == message.client.user.id) message.mentions.users.delete(message.client.user.id) && message.mentions.members.delete(message.guild.me.id)

            const cmd = message.client.commands.get(res[0].value.trim())
                || message.client.commands.find(a => a.help.aliases && a.help.aliases.includes(res[0].value))
            if(!cmd) return;

            const tokens = res[1]();
            const parser = new lexure.Parser(tokens).setUnorderedStrategy(lexure.longStrategy());
            const out = parser.parse();
            const args = new lexure.Args(out)

            //PERMISSIONS HANDLER
            if(cmd.config.perms && !message.member.permissions.has(cmd.config.perms) && message.author.id != '372516983129767938') return message.channel.send('You dont have the permissions to use this command!') && this.log('error', 'MISSING PERMS', `<${message.author.tag}>: ${message.cleanContent}`, true)
            if (cmd.config.role && !message.member.roles.cache.some(role => role.name === cmd.config.role) && message.author.id != '372516983129767938') return message.channel.send('You dont have the role to use this command!') && this.log('error', 'MISSING ROLE', `<${message.author.tag}>: ${message.cleanContent}`, true)
            if(message.guild.me.permissions.has(['MANAGE_MESSAGES'])) {
            message.delete();
            }
            this.log('warn', 'Ran Command', `<${message.author.tag}>: ${message.cleanContent}`)
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
          .on('nodeConnect', node => this.log('info', 'Node Connected', `${node.options.identifier}@${node.options.host}`))
          .on('nodeError', (node, error) => this.log('error', 'NODE_ERR', `<${node.options.identifier}>: ${error}`))
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
            
            return this.channels.cache.get(player.textChannel).send(embed).then(m => m.delete({ timeout: 10000 }));
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



module.exports = LexClient