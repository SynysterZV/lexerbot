const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "dm",
    desc: "DM's a user",
    aliases: [],
    category: "mod",
    usage: "{ User }",
  },
  config: {
    perms: ["MANAGE_GUILD"],
    role: false,
  },
  async execute(message, args) {
    if (message.mentions.users.first()) args.single();
    const user =
      message.mentions.users.first() ||
      (await message.guild.members.fetch(args.single()));
    const mes = joinTokens(args.many());
    if (!mes) return message.reply("You need to specify a message!");

    user.send(mes);
  },
};
