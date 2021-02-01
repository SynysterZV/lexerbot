module.exports = (client, member) => {
  if (member.user.username == "Varkatzas") return;
  const { MessageEmbed } = require("discord.js");
  member.client.guilds.fetch(member.guild.id);
  const channel = member.guild.channels.cache.find(
    (c) => c.name === "member-log" || c.name === "testing"
  );
  if (!channel) return;
  const embed = new MessageEmbed()
    .setTitle("Member Left")
    .setAuthor(
      `${member.user.tag}`,
      member.user.displayAvatarURL(),
      `https://discord.com/users/${member.user.id}`
    )
    .addFields(
      {
        name: "**Joined:**",
        value: new Date(member.joinedAt).toLocaleString(),
        inline: true,
      },
      {
        name: "**Left:**",
        value: `${new Date(Date.now()).toLocaleString()} EST`,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
      {
        name: "**ID:**",
        value: member.user.id,
        inline: true,
      },
      {
        name: "**Profile:**",
        value: member.user,
        inline: true,
      }
    )
    .setFooter(member.guild.name, member.guild.iconURL())
    .setTimestamp()
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setColor("RED");
  client.log("error", "MEMBER LEFT", member.user.tag);
  channel.send(embed);
};
