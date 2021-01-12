module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    client.manager.init(client.user.id)
}