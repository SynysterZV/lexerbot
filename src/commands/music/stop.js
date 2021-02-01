module.exports = {
  help: {
    name: "stop",
    desc: "stops a song",
    aliases: ["st"],
    category: "music",
  },
  config: {
    perms: [],
    role: false,
  },

  execute(message, args) {
    const player = message.client.manager.get(message.guild.id);
    const { channel } = message.member.voice;

    if (!channel) return message.reply("You need to be in a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("Youre not in the same voice channel");

    if (!player) return message.reply("There is nothing currently playing");

    player.destroy();
    return message.reply("Stopped the player!");
  },
};
