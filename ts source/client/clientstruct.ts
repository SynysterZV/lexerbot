import { settings } from 'cluster';
import * as Discord from 'discord.js'
import fs from 'fs'
import * as lexure from 'lexure'

interface configInt {
    token: string,
    presence?: Discord.PresenceData,
    prefix?: string 
}

export default class extends Discord.Client {
    public commands = new Discord.Collection<string, any>()
    public start: Function;
    public lex: Function;
    public config: configInt;
    constructor(config: configInt){
        super({
            allowedMentions: { parse: ['users', 'roles']},
            partials: ['MESSAGE', 'GUILD_MEMBER'],
            presence: config.presence
        })

        this.config = config
        
        this.start = () => {
            if(!config.token) throw 'Please input a valid token!'
            this.login(config.token)
        }
    fs.readdir('./build/commands', (err, files) => {
        if(err) throw err;
        files.forEach((f: string) => {
            console.log(f)
            const command = require(`../commands/${f}`)
            this.commands.set(command.help.name, command.default)
        })
    })

    fs.readdir('./build/events', (err, files) => {
        if(err) throw err;
        files.forEach((f: string) => {
            const event = require(`../events/${f}`)
            const eventName = f.split('.')[0]
            this.on(eventName, event.bind(null, this))
        })
    })

    this.lex = (message: Discord.Message) => {
        const lexer = new lexure.Lexer(message.content)
        const res = lexer.lexCommand(s => s.startsWith(this.config.prefix || '!') ? 1 : null)
        if (res == null) return;
        const cmd = this.commands.get(res[0].value)
            || this.commands.find(a => a.help.aliases && a.help.aliases.includes(res[0].value))
        if(!cmd) return;
        const tokens = res[1]();
        const parser = new lexure.Parser(tokens).setUnorderedStrategy(lexure.longStrategy());
        const out = parser.parse();
        const args = new lexure.Args(out)
        return { cmd, args };
    }
    }
}