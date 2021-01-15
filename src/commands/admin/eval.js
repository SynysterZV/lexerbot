const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

const { joinTokens } = require('lexure');
const request = require('request-promise')
const tr = require('googletrans').default

module.exports = {
    help: {
        name: 'eval',
        desc: 'Evaluate a command',
        aliases: [],
        category: 'admin',
        usage: '{ code }'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {

        const ping = message.client.ws.ping



        if(message.author.id !== '372516983129767938') return message.channel.send('You cannot use this command!') && message.client.log('error', 'NON_AUTH_EVAL', `${message.author.tag}`)
        let evaled

        const c = args.save()

        if(args.single() === 'command') {
            const command = message.client.commands.get(args.single()) || message.client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args.single()));
            if (!command) return message.channel.send('That command doesnt exist!')

            evaled = await command.execute.toString(); 
        } else {
        try {
            args.restore(c)
            const code = joinTokens(args.many()).replace(/(^`{1,3}|(?<=```)js)|`{1,3}$/g, '').trim()
            message.client.log('debug', 'Evaluate', code)
            evaled = await eval(`( async () => {
                return ${code}
            })()`);
        } catch (err) {
            return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
        }}

        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

        evaled = evaled.replace(message.client.config.keyring.discord, 'YOU THOUGHT 🤣')

        message.channel.send(clean(evaled), {code:"xl", split: true});
    }
}