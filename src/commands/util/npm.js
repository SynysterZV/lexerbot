const moment = require('moment')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'npm',
        desc: 'npm',
        aliases: [],
        category: 'util'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        const DATE_FORMAT_WITH_SECONDS = 'YYYY/MM/DD HH:mm:ss'
        const s = args.save()
        const pkg = args.single()
        const res = await fetch(`https://registry.npmjs.com/${pkg}`)
        if (res.status === 404) {
            return message.reply('This pacakge doesnt exist!')
        }
        const body = await res.json();
        if (body.time?.unpublished) {
             return message.reply('This package is unpublished')
        }

        const version = body['dist-tags'] ? body.versions[body['dist-tags']?.latest] : {}
        const dependencies = version.dependencies ? Object.keys(version.dependencies) : null
        const embed = new MessageEmbed()
            .setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com')
            .setTitle(body.name)
            .setURL(`https://www.npmjs.com/package/${pkg}`)
            .setDescription(body.description || 'No Description.')
            .addField('❯ Version', body['dist-tags']?.latest ?? 'Unknown', true)
			.addField('❯ License', body.license || 'None', true)
			.addField('❯ Author', body.author ? body.author.name : 'Unknown', true)
			.addField('❯ Creation Date', moment.utc(body.time.created).format(DATE_FORMAT_WITH_SECONDS), true)
			.addField('❯ Modification Date', moment.utc(body.time.modified).format(DATE_FORMAT_WITH_SECONDS), true)
			.addField('❯ Main File', version.main || 'index.js', true)
			.addField('❯ Dependencies', dependencies?.length ? dependencies.join(', ') : 'None')

            
        return message.client.emit('reactDelete', (await message.channel.send(embed)), message.author)
    }
}