const { MessageEmbed } = require('discord.js')

module.exports = {
    help: {
        name: 'rewind',
        desc: 'rewinds a song',
        aliases: ['rw'],
        category: 'music'
    },
    config: {
        perms: [],
        role: false
    },

    execute(message, args) {
        function hmsToSecondsOnly(str) {
            const p = str.split(':');
            let s = 0, m = 1;

            while(p.length > 0) {
                s = +m * parseInt(p.pop(), 10);
                m = m * 60;
            }
            return s;
        }

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.channel.send('There is no player for this guild!');

        const { channel } = message.member.voice;
        if(!channel) return message.reply('You need to be in a voice channel');

        const time = hmsToSecondsOnly(args.single()) * 1000;
        if (player.position - time < 0) {
            message.channel.send(`You cannot rewind that far!`)
        }
        else {
            player.seek(player.position - time);
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setDescription(`Time Rewinded to ${new Date(player.position).toISOString().slice(14, 19)}.`);
            message.channel.send(embed);
        }
    }
}