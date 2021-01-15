module.exports = (client) => {
    client.log('success', 'Client Ready', `${client.user.tag}`)
    client.user.setPresence(client.config.presence)
    client.manager.init(client.user.id)
}