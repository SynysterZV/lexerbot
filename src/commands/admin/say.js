const lexure = require('lexure');

module.exports = {
    help: {
        name: 'say',
        desc: 'Make bot say something',
        aliases: ['s'],
        category: 'admin'
    },
    config: {
        perms: ['ADMINISTRATOR'],
        role: false
    },
    execute(message, args) {
        const say = lexure.joinTokens(args.many());
        message.channel.send(say)
        const flag = args.option('flag') ?? 'none'
        message.channel.send(`Flags: ${flag}`)
    }
}