module.exports = {
    help: {
        name: 'tag',
        desc: 'Displays tags',
        aliases: [],
        category: 'tags'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const tagName = args.single()

        const tag = await message.client.util.tags(tagName)
        if(!tag) return message.reply('There is no tag by that name!')

        message.channel.send(tag.content)
    }
}