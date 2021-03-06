module.exports = (client, member) => {
  if (member.user.username == "Varkatzas") return;
  const { MessageEmbed } = require("discord.js");
  const channel = member.guild.channels.cache.find(
    (c) => c.name === "member-log" || c.name === "testing"
  );
  member.client.guilds.fetch(member.guild.id);
  if (!channel) return;
  const embed = new MessageEmbed()
    .setTitle("Member Joined")
    .setAuthor(
      `${member.user.tag}`,
      member.user.displayAvatarURL(),
      `https://discord.com/users/${member.user.id}`
    )
    .addFields(
      {
        name: "**Created At:**",
        value: new Date(member.user.createdAt).toDateString(),
        inline: true,
      },
      {
        name: "**Joined:**",
        value: `${new Date(member.joinedAt).toLocaleString()} EST`,
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
    .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
    .setTimestamp()
    .setColor("GREEN");
  client.log("success", "MEMBER JOINED", member.user.tag);
  channel.send(embed);
};
