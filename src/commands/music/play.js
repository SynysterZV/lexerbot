const { joinTokens } = require('lexure')

module.exports = {
    help: {
        name: 'play',
        desc: 'Plays music',
        aliases: ['p'],
        category: 'music',
        usage: '{ URL | Song name } --f(flag/ first)'
    },
    config: {
        perms: [],
        role: false
    },

    async execute(message, args){

        const { channel } = message.member.voice;
        const query = joinTokens(args.many())
        const first = args.flag('first', 'f')

        if(!channel) return message.reply('you must be in a voice channel!');
        if(!query) return message.reply('you must supply a URL or search term!');

        const player = message.client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
          });

        if(player.state !== 'CONNECTED') player.connect();

        try {
            res = await player.search(query, message.author);
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
              player.queue.add(res.tracks[0]);
  
              if (!player.playing && !player.paused && !player.queue.size) return player.play();
              return message.reply(`Adding \`${res.tracks[0].title}\` to the queue.`);
            case 'PLAYLIST_LOADED':
              player.queue.add(res.tracks);
  
              if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
              return message.reply(`Adding playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks to the queue.`);
            case 'SEARCH_RESULT':
              if(first) {
                const track = res.tracks[0];
                player.queue.add(track);
        
          
                if (!player.playing && !player.paused && !player.queue.size) return player.play();
                return message.reply(`adding \`${track.title}\` to the queue.`);
              }
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
              collected.first().delete()
  
              if (first.toLowerCase() === 'end') {
                if (!player.queue.current) player.destroy();
                return message.channel.send('Cancelled selection.');
              }
  
              const index = Number(first) - 1;
              if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);
            
  
              const track = res.tracks[index];
              player.queue.add(track);
              msg.delete();
  
              if (!player.playing && !player.paused && !player.queue.size) return player.play();
              return message.reply(`adding \`${track.title}\` to the queue.`);
          });


        
          }
    }
}