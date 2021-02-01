const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "user",
    desc: "Display User info",
    aliases: [],
    category: "info",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    let embed;
    const mem = args.single();
    if (!mem) {
      const roles = message.member.roles.cache
        .sort((a, b) => b.position - a.position)
        .filter((r) => r.name != "@everyone")
        .map((r) => `\`${r.name}\``)
        .join(", ");
      const joinedTime = new Date(message.member.joinedAt).toDateString();
      const createdTime = new Date(message.author.createdAt).toDateString();
      embed = new MessageEmbed()
        .setThumbnail(
          message.author.displayAvatarURL({ dynamic: true, size: 512 })
        )
        .setFooter(`Requested by ${message.author.tag}`)
        .addFields(
          {
            name: "❯ Member Details",
            value: `• Nickname: \`${
              message.member.nickname || "None"
            }\`\n• Roles: ${roles}\n• Joined: \`${joinedTime}\`\n• Activity: \`${
              message.member.presence.activities[0]?.name || "None"
            }\``,
          },
          {
            name: "❯ User Details",
            value: `• ID: \`${message.author.id}\`\n• Username: \`${message.author.tag}\`\n• Created: \`${createdTime}\`\n• Status: \`${message.author.presence.status}\``,
          }
        );
    } else {
      const member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch(mem).catch(() => {}));
      if (!member) {
        user = await message.client.users.fetch(mem).catch(() => {});
        if (!user) return message.channel.send("That is not a valid user!");
        const createdTime = new Date(user.createdAt).toDateString();
        embed = new MessageEmbed()
          .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
          .setFooter(`Requested by ${message.author.tag}`)
          .addFields({
            name: "❯ User Details",
            value: `• ID: \`${user.id}\`\n• Username: \`${user.tag}\`\n• Created: \`${createdTime}\`\n• Status: \`${user.presence.status}\``,
          });
        return message.channel.send(embed);
      }
      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((r) => `\`${r.name}\``)
        .join(", ");
      const joinedTime = new Date(member.joinedAt).toDateString();
      const createdTime = new Date(member.user.createdAt).toDateString();
      embed = new MessageEmbed()
        .setThumbnail(
          member.user.displayAvatarURL({ dynamic: true, size: 512 })
        )
        .setFooter(`Requested by ${message.author.tag}`)
        .addFields(
          {
            name: "❯ Member Details",
            value: `• Nickname: \`${
              member.nickname || "None"
            }\`\n• Roles: ${roles}\n• Joined: \`${joinedTime}\`\n• Activity: \`${
              member.presence.activities[0]?.name || "None"
            }\``,
          },
          {
            name: "❯ User Details",
            value: `• ID: \`${member.user.id}\`\n• Username: \`${member.user.tag}\`\n• Created: \`${createdTime}\`\n• Status: \`${member.user.presence.status}\``,
          }
        );
    }

    message.channel.send(embed);
  },
};
