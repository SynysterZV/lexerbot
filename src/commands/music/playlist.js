const { Collection } = require('discord.js')

module.exports = {
    help: {
      name: "playlist",
      desc: "make a playlist out of the queue",
      aliases: [],
      category: "music",
    },
    config: {
      perms: [],
      role: false,
    },
    execute(message, args) {
       const queue = message.client.manager.get(message.guild.id)?.queue

       if(!queue.current) return message.reply('There are no songs in queue!')

        const map = new Collection()
        queue.filter(g => g !== queue.current).forEach(track => {
            map.set(track.title, track)
        })
    },
  };