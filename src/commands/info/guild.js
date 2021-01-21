const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'guild',
        desc: 'Displays info for this guild',
        aliases: [],
        category: 'info'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {

        const n = args.flag('n', 'names')

        const createdAt = new Date(message.guild.createdAt).toDateString()

        if(n) {
            const embed = new MessageEmbed()
                .setDescription(message.client.guilds.cache.map(g => `• ${g.name}`).join('\n'))
                .setTitle('Guilds Im In!')
                .setThumbnail(message.client.user.displayAvatarURL())

            return message.channel.send(embed)
        }

        const tc = message.guild.channels.cache.filter(c => c.type === 'text').size
        const vc = message.guild.channels.cache.filter(c => c.type === 'voice').size
        const members = message.guild.members.cache.filter(m => !m.user.bot).size
        const bots = message.guild.members.cache.filter(m => m.user.bot).size
        const online = message.guild.members.cache.filter(m => !m.user.bot && m.user.presence.status === 'online').size
        const owner = await message.client.users.fetch(message.guild.ownerID)
        const roles = message.guild.roles.cache.size

        const embed = new MessageEmbed()
            .setDescription(`**__${message.guild.name}__** (ID: ${message.guild.id})`)
            .setThumbnail(message.guild.iconURL())
            .addFields(
                { name: '❯ Owner', value: `${owner} (ID: ${owner.id})`},
                { name: '❯ Channels', value: `• Text: ${tc}\n• Voice: ${vc}`},
                { name: '❯ Members', value: `• Humans: ${members}\n• Bots: ${bots}\n• Online: ${online}`},
                { name: '❯ Premium', value: `• Premium Level: ${message.guild.premiumTier}\n• Boosts: ${message.guild.premiumSubscriptionCount}`},
                { name: '❯ Other', value: `• Roles: ${roles}\n• Region: ${message.guild.preferredLocale}\n• Created At: ${createdAt}\n• Verification Level: ${message.guild.verificationLevel}`}  
            )

            message.channel.send(embed).then(m => m.reactDelete(message.author))
    }
}