module.exports = {
    help: {
        name: 'unmute',
        description: 'unmute a user',
        aliases: [],
        category: 'mod',
        usage: '{ User }'
    },
    config: {
        perms: [],
        role: require('../../client/config.json').mod.role
    },
    async execute(message, args) {
        const memberArg = args.single()
        const member = message.mentions.members.first() || await message.guild.members.fetch(memberArg)
        if(!member) return message.reply('Please provide a valid user!')

        if(!message.client.muted.has(member.user.id)) return message.reply('This user isnt muted!')

        const executor = message.author
        const roles = message.client.muted.get(member.id)
        const mutedRole = message.guild.roles.cache.find(r => r.name === message.client.config.mutedRole)

        member.roles.remove(mutedRole).then(m => {
            m.roles.add(roles)
            message.client.muted.delete(m.id)
            message.client.emit('modEvent', 'UNMUTE', { member, executor })
        })
        return message.reply(`Successfully unmuted **${member.user.tag}**`)
    }

    
}