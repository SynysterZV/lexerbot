const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'meme',
        desc: 'Displays random meme from reddit',
        aliases: ['reddit'],
        category: 'fun'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const sub = args.single() || 'memes'
        const base = `https://reddit.com/r/`
        const uri = encodeURI(`${base}${sub}/random/.json`)

        const res = await fetch(uri).then(res => res.json())
        if(!res[0].data) return message.reply('I couldnt find that subreddit!')

        const body = res[0].data.children[0].data
        const { 
                title,
                subreddit_name_prefixed, 
                ups, 
                downs, 
                num_comments, 
                url, created_utc, 
                is_video, 
                over_18, 
                media, 
                selftext 
                            } = body
        
        if(over_18) return message.reply('This content is NSFW')

        const embed = new MessageEmbed()
            .setTitle(subreddit_name_prefixed)
            .setDescription(`${title}\n[View Thread](${url})`)
            .setFooter(`${downs > 0 ? `👎 ${downs}` : `👍 ${ups}`} 💬 ${num_comments}`)
            .setTimestamp(new Date(created_utc * 1000))

        if(!is_video) {
            embed.setImage(url)
        }

        if(!media) {
            embed.description += `\n\n${selftext}`
        }

        message.channel.send({ embed })
    }
}