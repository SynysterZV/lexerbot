const lexure = require('lexure');

module.exports = {
    help: {
        name: 'ticket',
        desc: 'Make a ticket Channel',
        aliases: ['s'],
        category: 'admin'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
    if(message.mentions.members.first()) {
        if(!message.member.permissions.has(['ADMINISTRATOR'])) return message.channel.send('You need to be an administrator to make a ticket for somebody else!')
        args.single()
    }
    message.guild.channels.createTicket(lexure.joinTokens(args.many()), message, { parent: message.channel.parent });
    }
}