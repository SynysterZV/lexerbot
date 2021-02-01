module.exports = {
  help: {
    name: "resume",
    desc: "Resumes the player",
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

    if (!channel) return message.reply("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("Youre not in the same voice channel as the bot");
    if (!player.paused) return message.reply("The player is not paused");

    player.pause(false);
    return message.reply("Resumed the player.");
  },
};
