module.exports = {
    help: {
        name: 'ping',
        desc: 'Gets Ping',
        aliases: [],
        category: 'util',
    },
    config: {
        perms: false,
        role: false,
    },
    async execute (message, args) {
        message.channel.send('Loading..').then(m => {
            const ping = m.createdTimestamp - message.createdTimestamp
            m.edit('', { 
                embed: {
                    title: 'Pong!',
                    description: `Round-trip latency: ${ping}ms\nHeartbeat latency: ${message.client.ws.ping}ms`,
                }
            })
        })
    }
}