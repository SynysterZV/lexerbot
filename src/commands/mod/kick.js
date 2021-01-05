const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'kick',
        desc: 'Kicks a member',
        aliases: [],
        category: 'mod'
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

        await member.kick({reason}).catch(e => {console.log(e)})
        return message.reply(`Successfully kicked **${member.user.tag}** for **${reason}**`)
    }
}