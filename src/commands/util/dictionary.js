const { search } = require('google-dictionary-api')
const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'dictionary',
        desc: 'Looks up on the google dictionary',
        aliases: ['dict'],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const t = args.option('type', 't');
        const u = args.flag('u')

        let res = (await search(args.single(), 'en').catch(() => false))[0]
        if(!res) return message.reply('Im sorry, but I couldnt find the word you were looking for.')
        const { word } = res

        if(u) {
            const embed = new MessageEmbed()
                .setTitle('Word Types:')
                .setDescription(Object.keys(res.meaning).map(s=>s).join('\n'))

            return message.channel.send(embed)
        }

        if(t) {
            if(!res.meaning[t]) return message.reply(`The word ${word} cannot be used as a(n) ${t}`)
        }

        const ent =  Object.keys(res.meaning)[0]
        res = res.meaning[t] ? res.meaning[t][0] : res.meaning[ent][0]

        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`**${word}**\n${res.definition}`)
            .addField('Type:', t || ent)

        if(res.example) {
            embed.addField('Example:', res.example)
        }

        if(res.synonyms) {
            embed.addField('Synonyms:', res.synonyms.splice(0,5).map(m => m.toLowerCase()))
        }

        message.channel.send(embed)
    }
}