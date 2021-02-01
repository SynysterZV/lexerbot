const { MessageEmbed } = require("discord.js");

module.exports = async (client, guild) => {
  const owner = await guild.members.fetch(guild.ownerID);
  const aprox = guild.members.cache.filter((c) => !c.user.bot).size;
  const embed = new MessageEmbed()
    .setAuthor(owner.user.tag, owner.user.displayAvatarURL())
    .setTitle(`Guild Joined - ${guild.name}`)
    .setTimestamp()
    .addField(
      "Info",
      `• Members: ${aprox}\n• Channels: ${guild.channels.cache.size}`
    );
  return (await guild.client.fetchApplication()).owner
    .send(embed)
    .catch((e) => {});
};
