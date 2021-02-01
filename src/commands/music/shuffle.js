module.exports = {
  help: {
    name: "shuffle",
    desc: "shuffle the songs in the queue",
    aliases: [],
    category: "music",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const player = message.client.manager.get(message.guild.id);
    const times = parseInt(args.single()) || 1;
    const { channel } = message.member.voice;

    if (!channel) return message.reply("You need to be in a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("Youre not in the same voice channel");

    if (!player) return message.reply("There is nothing currently playing");

    let i = 0;
    while (i < times) {
      i++;
      player.queue.shuffle();
    }
    return message.channel.send("Queue successfully shuffled!");
  },
};
