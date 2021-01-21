const { Util } = require('discord.js')
const fetch = require('node-fetch')
const { MessageAttachment } = require('discord.js')

module.exports = {
    help: {
        name: 'steal',
        desc: 'Steal other servers emojis',
        aliases: [],
        category: 'fun'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const q = args.single()
        const name = args.single()
        const emojidata = await Util.parseEmoji(q)

        let url = emojidata.id
            ? `https://cdn.discordapp.com/emojis/${emojidata.id}.png?v=1` 
            : emojidata.animated 
            ? `https://cdn.discordapp.com/emojis/${emojidata.id}.gif?v=1` 
            : q

        const yes = await message.guild.emojis.create(url, (emojidata.name || name)).catch(e=>console.log(e))

        if (!yes) return message.reply('Something went wrong')
        return message.channel.send('Successfully stolen emoji!')


        
    }
}