const fetch = require('node-fetch')
const qs = require('querystring')
const Turndown = require('turndown')
const { joinTokens } = require('lexure')
const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'mdn',
        desc: 'mdn',
        aliases: [],
        category: 'util',
        usage: '{ search query }'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const query = joinTokens(args.many())
        const queryString = qs.stringify({ q: query })
        const res = await fetch(`https://mdn.gideonbot.com/embed?${queryString}`)
        const embed = await res.json()

        if (!embed) {
            return message.reply('I could not find that page')
        }

        return message.client.emit('reactDelete', await(message.channel.send({embed})), message.author)
    }
}