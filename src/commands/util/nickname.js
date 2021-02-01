const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "nick",
    desc: "Change your nickname",
    aliases: ["nickname"],
    category: "util",
    usage: "{ nickname }",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const target = args.option("m");
    const name = joinTokens(args.many());

    message.member.setNickname(name);

    if (target) {
      message.guild.members
        .fetch(message.mentions.members.first() || target)
        .then((m) => m.setNickname(name));
    }
  },
};
