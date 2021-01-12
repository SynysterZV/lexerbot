module.exports = {
    help: {
        name: 'clearqueue',
        desc: 'Clears the guilds queue',
        aliases: ['cq'],
        category: 'music'
    },
    config: {
        perms: [],
        role: false
    },

    execute(message, args) {
        const player = message.client.manager.get(message.guild.id);
        if(!player) return message.reply('There is no player in this guild')

        const { channel } = message.member.voice;
        if (!channel) return message.reply('You need to join a voice channel.')
        if (channel.id !== player.voiceChannel) return message.reply('You\'re not in the same channel as the player.');

        if(!player.queue.current) return message.reply('There is no music playing');

        player.queue.clear();
        return message.reply('Queue Cleared!')
    }
}