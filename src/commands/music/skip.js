module.exports = {
  help: {
    name: "skip",
    desc: "Skips current song, a song from the queue, or a range of songs",
    aliases: ["s"],
    category: "music",
    usage: "{ None | Queue # | Queue Range}",
  },
  config: {
    perms: [],
    role: false,
  },

  execute(message, args) {
    const player = message.client.manager.get(message.guild.id);
    if (!player) return message.reply("There is no player for this guild");

    const num = args.single();
    const num2 = args.single();

    const { channel } = message.member.voice;
    if (!channel) return message.reply("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("You're not in the same channel as the player.");

    if (!player.queue.current)
      return message.reply("There is no music playing!");

    const { title } = player.queue.current;
    let song;

    if (!message.member.hasPermission("ADMINISTRATOR")) {
      if (player.queue.current.requester.id !== message.author.id)
        return message.reply("You did not request this track!");
    }

    if (!num) {
      player.stop();
      song = `${title} was skipped`;
    } else if (num) {
      if (isNaN(num))
        return message.reply("You must reply which track NUMBER to skip!");
      song = `${player.queue[num - 1].title} was skipped`;

      player.queue.remove(num - 1);
    } else if (num2) {
      if (isNaN(num) || isNaN(num2))
        return message.reply("You must specify which track NUMBERS to skip!");
      song = `${num2 - num + 1} Tracks Skipped`;
      player.queue.remove(num - 1, num2);
    }
    return message.reply(`${song}`);
  },
};
