const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'kick',
        desc: 'Kicks a member',
        aliases: [],
        category: 'mod',
        usage: '{ User }'
    },
    config: {
        perms: ['KICK_MEMBERS'],
        role: false
    },
    async execute(message, args) {
        const memberArg = args.single()
        const member = message.mentions.members.first() || await message.guild.members.fetch(memberArg)
        if(!member) return message.channel.send('That member does not exist')

        const reason = joinTokens(args.many()) || 'No Reason Provided'
        const executor = message.author

        await member.kick({reason}).catch(e => {console.log(e)})
        message.client.emit('modEvent', 'KICK', {member, reason, executor})
        return message.reply(`Successfully kicked **${member.user.tag}** for **${reason}**`)
    }
}