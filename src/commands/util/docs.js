const lexure = require('lexure')
const qs = require('querystring')
const fetch = require('node-fetch')

module.exports = {
    help: {
        name: 'docs',
        desc: 'Shows DJS docs',
        aliases: [],
        category: 'util',
    },
    config: {
        perms: false,
        role: false,
    },
    async execute(message, args) {
        const query = lexure.joinTokens(args.many());
        let source = args.option('src') ?? 'stable';
        const force = args.flag('force', 'f');
        const includePrivate = args.flag('private', 'p');
        const q = query.split(' ');
        console.log( query, source )

        if (!message.client.constants.DOCUMENTATION_SOURCES.includes(source)) return message.channel.send('That source doesnt exist!')
        if (source === 'v11') source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;

        const queryString = qs.stringify({ src: source, q: q.join(' '), force, includePrivate })
        const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`).then(res => res.json());

        if(!embed) {
            message.channel.send('No Results!')
        }
        return message.client.emit('reactDelete', (await message.channel.send({embed})), message.author)

    }
}