const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'urban',
        desc: 'Urban Dicitonary Lookup',
        aliases: ['u'],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const regex = new RegExp(/\[([\w\s,]+)\]/g)
        const uri = `http://api.urbandictionary.com/v0/define?term=${joinTokens(args.many())}`

        const res = await fetch(uri).then(res => res.json())

        const def = res.list[0]
        console.log(def)

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