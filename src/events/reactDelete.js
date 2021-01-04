module.exports = (client, message, author) => {
    message.react('🗑️')

    const filter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === author.id

    message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time']})
        .then((collected) => {
            message.delete() }).catch((collected) => {
                message.reactions.removeAll() })
}
