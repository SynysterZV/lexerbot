const { MessageEmbed } = require("discord.js");
const createBar = require("string-progressbar");

module.exports = {
  help: {
    name: "nowplaying",
    desc: "Displays the now playing song",
    aliases: ["np"],
    category: "music",
  },
  config: {
    perms: [],
    role: false,
  },

  execute(message, args) {
    const player = message.client.manager.get(message.guild.id);
    if (!player) return message.reply("There is no player for this guild");

    const { title, requester, thumbnail, uri, duration } = player.queue.current;
    const slicenum = duration > 60 * 60 * 1000 ? 12 : 14;

    const bar =
      new Date(player.position).toISOString().slice(slicenum, 19) +
      " [" +
      createBar(
        duration == 0 ? player.position : duration,
        player.position,
        15
      )[0] +
      "] " +
      new Date(duration).toISOString().slice(slicenum, 19);
    const guild = message.guild;
    const embed = new MessageEmbed()
      .setAuthor(requester.tag, requester.displayAvatarURL())
      .setFooter(guild, guild.iconURL())
      .setTimestamp()
      .setTitle("» Now Playing:")
      .setThumbnail(thumbnail)
      .setDescription(`\n[${title}](${uri})`)
      .setColor(0xff0000)
      .addField("\u200b", bar, false);

    message.channel.send(embed).then((m) => m.delete({ timeout: 30000 }));
    message.delete();
  },
};
