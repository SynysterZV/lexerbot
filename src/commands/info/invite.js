module.exports = {
    help: {
        name: 'invite',
        desc: 'Invite the bot to your server',
        aliases: [],
        category: 'info'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        message.client.generateInvite({
            permissions: ['ADMINISTRATOR']
        }).then(l => message.channel.send(`Invite me to your server!\n <${l}>`))
    }
}