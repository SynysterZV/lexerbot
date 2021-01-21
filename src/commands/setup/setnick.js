const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'setnick',
        desc: 'Set the bots nickname',
        aliases: [],
        category: 'setup'
    },
    config: {
        perms: ['MANAGE_NICKNAMES'],
        role: 'MODERATOR'
    },
    execute(message, args) {
        const nick = joinTokens(args.many())
        try {
            if(nick === 'reset') {
                message.guild.me.setNickname(message.client.user.username)
                return message.channel.send('My nickname has been successfully reset')
            }
            message.guild.me.setNickname(nick)
            message.channel.send(`My nickname has successfully been set to ${nick}`)
        } catch (e){
            message.channel.send('Something went wrong!')
            message.client.log('error', 'NICKNAME_ERR', e)
        }
    }
}