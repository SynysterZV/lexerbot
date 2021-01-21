const figlet = require('figlet')
const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'ascii',
        desc: 'Converts text into ascii art',
        aliases: [],
        category: 'fun'
    },
    config: {
        perms: [],
        role: false
    },
    async execute(message, args) {
        let text = joinTokens(args.many())
        if(!text) return message.reply('You need to supply text!')

        await figlet(text, (err, data) => {
            if(err) {
                console.log('Whoops!')
                console.dir(err)
                return;
            }
            text = data
        })

        message.channel.send(`\`\`\`${text}\`\`\``).catch(() => message.reply('The output would be too long to display correctly!'))
    }
}