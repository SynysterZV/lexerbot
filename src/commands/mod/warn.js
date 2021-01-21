const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'warn',
        desc: 'Warns a user',
        aliases: [],
        category: 'mod',
        usage: '{ User } { Reason }'
    },
    config: {
        perms: [],
        role: require('../../client/config.json').mod.role
    },
    async execute(message, args) {
        const memberArg = args.single()
        const member = message.mentions.members.first() || await message.guild.members.fetch(memberArg)
        if (!member) return message.reply('Please provide a valid user!')

        const reason = joinTokens(args.many())
        if(!reason) return message.reply('Please provide a warn reason!')
        const executor = message.author

        message.client.emit('modEvent', 'WARN', {member, reason, executor, context: message.url })
        return message.reply(`Successfully warned **${member.user.tag}** for **${reason}**`)
    }

    
}