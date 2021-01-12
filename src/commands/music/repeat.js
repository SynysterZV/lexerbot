module.exports = {
    help: {
        name: 'repeat',
        desc: 'Sets Repeat mode',
        aliases: [],
        category: 'music'
    },
    config: {
        perms: [],
        role: false
    },

    execute(message, args) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('There is no player for this guild');
        const type = args.single()

        const { channel } = message.member.voice;

        if (!channel) return message.reply('You need to join a voice channel');
        if (channel.id !== player.voiceChannel) return message.reply('Youre not in the same voice channel as the bot');

        if (type && /queue/i.test(type)) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? 'enabled' : 'disabled';
            return message.reply(`${queueRepeat} queue repeat.`);
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? 'enabled' : 'disabled';
        return message.reply(`${trackRepeat} track repeat.`);
    }
}