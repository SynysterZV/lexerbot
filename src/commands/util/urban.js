const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'urban',
        desc: 'Urban Dicitonary Lookup',
        aliases: ['u'],
        category: 'util',
        usage: '{ search query | none for random }'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const regex = new RegExp(/\[([\w\s,]+)\]/g)
        const baseuri = `http://api.urbandictionary.com/v0/`
        const query = joinTokens(args.many())
        let uri = `${baseuri}define?term=${query}`

        if(!query) {
            uri = `${baseuri}random`
        }

        uri = encodeURI(uri)

        const res = await fetch(uri).then(res => res.json())
        if(!res.list.length) {
            return message.reply('Im sorry, I couldnt find that word on Urban Dictionary!')
        }
        const def = res.list[0]

        const embed = new MessageEmbed()
            .setAuthor(`Urban Dictionary`, 'https://play-lh.googleusercontent.com/unQjigibyJQvru9rcCOX7UCqyByuf5-h_tLpA-9fYH93uqrRAnZ0J2IummiejMMhi5Ch')
            .setColor('YELLOW')
            .setTitle(def.word.cap())
            .setURL(def.permalink)
            .setDescription(def.definition.replace(regex, '$1'))
            .addFields(
                { name: 'Author:', value: def.author},
                { name: 'Written On:', value: new Date(def.written_on).toDateString()}
                )
            .setFooter(`👍 ${def.thumbs_up} 👎 ${def.thumbs_down}`)

        message.channel.send(embed)
    }
}