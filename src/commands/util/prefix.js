module.exports = {
    help: {
        name: 'prefix',
        desc: 'Change guilds prefix',
        aliases: [],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const prefix = args.single()

        if(prefix) {
            if(!message.member.permissions.has('ADMINISTRATOR') && message.author.id != '372516983129767938') return message.reply('Youre not allowed to change the guild prefix') && message.client.log('error', 'NON_AUTH_PREFIX_CH', `${message.author.tag}: ${prefix}`)
            message.client.prefixes.set(message.guild.id, prefix)
            return message.reply(`Prefix successfully set to \`${prefix}\``)
        } else {
            const pr = await message.client.prefixes.get(message.guild.id) 
            message.client.log('success', 'PREFIX_CHANGE', `${message.author.tag}: ${prefix}`)
            return message.reply(`Guilds prefix is \`${pr || message.client.config.prefix}\``)
        }
    }
}