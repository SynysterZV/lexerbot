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
        message.delete()
        message.channel.send('Loading..').then(m => {
            const ping = m.createdTimestamp - message.createdTimestamp
            m.edit(`Pong! Latency is ${ping}ms`)
        })
    }
}