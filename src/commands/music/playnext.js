const { joinTokens } = require('lexure')

module.exports = {
  help: {
    name: 'playnext',
    desc: 'Plays a certain song next',
    aliases: ['px'],
    category: 'music',
    usage: '{ Song | Position in Queue }'
},
config: {
    perms: [],
    role: false
},

    async execute(message, args) {
        const player = message.client.manager.get(message.guild.id)
        if(!player) return message.reply('There is no player for this guild');
        const arg = joinTokens(args.many())
        const { channel } = message.member.voice;
        if(!channel) return message.reply('You need to be in a voice channel');
        if(channel.id !== player.voiceChannel) return message.reply('You are not in the same channel as the player');

        if (!player.queue.current) return message.reply('There is no music playing');

        if(isNaN(arg)) {
            const search = arg
        let res;

        try {
            res = await player.search(search, message.author);
            if (res.loadType === 'LOAD_FAILED') {
              if (!player.queue.current) player.destroy();
              throw res.exception;
            }
          }
          catch (err) {
            return message.reply(`there was an error while searching: ${err.message}`);
          }

          switch (res.loadType) {
            case 'NO_MATCHES':
              if (!player.queue.current) player.destroy();
              return message.reply('there were no results found.');
            case 'TRACK_LOADED':
              player.queue.splice(0, 0, res.tracks[0]);
  
              if (!player.playing && !player.paused && !player.queue.size) return player.play();
              return message.reply(`Adding \`${res.tracks[0].title}\` to the queue.`);
            case 'SEARCH_RESULT':
              let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
              if (res.tracks.length < max) max = res.tracks.length;
  
              const results = res.tracks
                  .slice(0, max)
                  .map((track, index) => `${++index} - \`${track.title}\``)
                  .join('\n');
  
              message.channel.send(results).then(async msg => {
  
              try {
                collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
              }
              catch (e) {
                if (!player.queue.current) player.destroy();
                return message.reply('you didn\'t provide a selection.');
              }
  
              const first = collected.first().content;
  
              if (first.toLowerCase() === 'end') {
                if (!player.queue.current) player.destroy();
                return message.channel.send('Cancelled selection.');
              }
  
              const index = Number(first) - 1;
              if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);
  
              const track = res.tracks[index];
              player.queue.splice(0, 0, track);
              msg.delete();
  
              if (!player.playing && !player.paused && !player.queue.size) return player.play();
              return message.reply(`adding \`${track.title}\` to the queue.`);
          });
          }
        }

        const track = player.queue.splice(arg - 1 , 1)
        player.queue.splice(0, 0, track[0])
    }
}