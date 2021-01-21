const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'unban',
        desc: 'Unbans a user',
        aliases: [],
        category: 'mod',
        usage: '{ User } { Reason }'
    },
    config: {
        perms: ['BAN_MEMBERS'],
        role: require('../../client/config.json').mod.role
    },
    async execute(message, args) {
        const memberArg = args.single()

        const ban = await message.guild.fetchBan(memberArg).catch(e => false)
        if(!ban) return message.reply('This user either doesnt exist or was never banned!')

        const user = ban.user
        const guild = message.guild
        const executor = message.author
        const reason = joinTokens(args.many()) || 'None'

        message.client.emit('modEvent', 'UNBAN', { guild, user, executor, reason })
        guild.members.unban(user)
        return message.reply(`Successfully unbanned **${user.tag}** for **${reason}**`)
    }

    
}