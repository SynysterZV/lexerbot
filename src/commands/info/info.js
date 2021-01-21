module.exports = {
    help: {
        name: 'info',
        desc: 'Displays the bots info',
        aliases: [],
        category: 'info'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        let userCount = 0
        message.client.guilds.cache.forEach(async g => {
            const actualMemberCount = g.members.cache.filter(f => !f.user.bot).size
            userCount += Number(actualMemberCount)
        })

        const mem = (process.memoryUsage().heapUsed)/1000000
        const cpu = (process.cpuUsage().system)/1000000

        const CA = await message.client.fetchApplication()
        const embed = new (require('discord.js')).MessageEmbed()
            .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
            .setTitle('Info')
            .addFields(
                {
                    name: '**Discord Data**', value: `•Guilds: \`${message.client.guilds.cache.size}\`\n•Channels: \`${message.client.channels.cache.size}\`\n•Users: \`${userCount}\``
                },
                {
                    name: 'Usage Stats', value: `•CPU Usage: \`${Math.round(cpu)}%\`\n•Memory Usage: \`${Math.round(mem)}MB\``
                },
                {
                    name: '**Owner**', value: CA.owner
                },
                {
                    name: '**Application Created:**', value: new Date(CA.createdTimestamp).toDateString()
                },
                {
                    name: '**Uptime:**', value: `${Math.ceil(message.client.uptime / (1000 * 60))} minutes`
                }
            )
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
            .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true, size: 512}))

            return (await message.channel.send(embed)).reactDelete(message.author)
    }
}