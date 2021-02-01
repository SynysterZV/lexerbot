const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "pfp",
    desc: "Get a users pfp",
    aliases: ["avatar"],
    category: "info",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    let embed;
    let user = args.single();
    if (user === "bot") user = message.client.user;
    else
      user =
        message.mentions.users.first() ||
        (await message.client.users.fetch(user).catch((e) => false)) ||
        message.author;
    const { tag } = user;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 512 });

    embed = new MessageEmbed()
      .setTitle(`${tag}'s PFP`)
      .setDescription(`[Link](${avatar})`)
      .setImage(avatar);

    message.channel.send(embed);
  },
};
