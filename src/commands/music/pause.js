module.exports = {
  help: {
    name: "pause",
    desc: "Pauses the player",
    aliases: [],
    category: "music",
  },
  config: {
    perms: [],
    role: false,
  },

  execute(message, args) {
    const player = message.client.manager.get(message.guild.id);
    if (!player) return message.reply("There is no player for this guild");

    const { channel } = message.member.voice;

    if (!channel) return message.reply("You need to be in a voice channel");
    if (channel.id !== player.voiceChannel)
      return message.reply("Youre not in the same voice channel as the bot");
    if (player.paused) return message.reply("The player is already paused");

    player.pause(true);
    return message.reply("Paused the player");
  },
};
