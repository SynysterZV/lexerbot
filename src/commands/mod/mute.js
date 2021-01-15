const { joinTokens } = require('lexure')

const timeVal = t => {
    const regx = new RegExp(/\d[s|m|h|d]/)
    if(!regx.test(t)) return false
    let ms = 0

    const q = t.replace(/[A-Za-z]+/, '').trim()

    if(t.includes('s')) {
        ms = q * 1000
    } else if(t.includes('m')) {
        ms = q * 1000 * 60
    } else if(t.includes('h')) {
        ms = q * 1000 * 60 * 60
    } else if(t.includes('d')) {
        ms = q * 1000 * 60 * 60 * 24
    }
    return ms
}

module.exports = {
    help: {
        name: 'mute',
        description: 'Mute a user',
        aliases: [],
        category: 'mod',
        usage: '{ User } { Reason } <--t=1s|1m|1h|1d>'
    },
    config: {
        perms: [],
        role: require('../../client/config.json').mod.role
    },
    async execute(message, args) {
        const memberArg = args.single()
        const member = message.mentions.members.first() || await message.guild.members.fetch(memberArg)
        if(!member) return message.reply('Please provide a valid user!')

        const reason = joinTokens(args.many()) || 'None'
        const executor = message.author
        const time = args.option('t', 'time') || '1d'

        const timevar = timeVal(time)
        if(!timevar || timevar > 1000 * 60 * 60 * 24 * 7) return message.reply('Please provide a valid time between 1 second and 7 days')

        const roles = member.roles.cache.map(r=>r.id)
        const mutedRole = message.guild.roles.cache.find(r => r.name === message.client.config.mutedRole)

        if(message.client.muted.has(member.id)) return message.reply('This user is already muted!')

        member.roles.remove(roles).then(m => {
            m.roles.add(mutedRole)
            message.client.muted.set(m.id, roles)
            message.client.emit('modEvent', 'MUTE', { member, reason, executor, time })

            setTimeout(async () => {
                if(!message.client.muted.has(m.id)) return
                message.client.muted.delete(m.id)
                m.roles.remove(mutedRole).catch(e => message.client.log('error', 'MUTE_ERR', e))
                m.roles.add(roles)
            }, timevar)
        })
        return message.reply(`Successfully muted **${member.user.tag}** for **${reason}** (Time: ${time})`)
    }

    
}