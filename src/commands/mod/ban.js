const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "ban",
    desc: "Bans a guild member",
    aliases: [],
    category: "mod",
    usage: "{ User }",
  },
  config: {
    perms: ["BAN_MEMBERS"],
    role: false,
  },
  async execute(message, args) {
    const memberArg = args.single();
    const member =
      message.mentions.members.first() ||
      (await message.guild.members.fetch(memberArg).catch((e) => {}));
    if (!member) return message.reply("That user doesnt exist!");

    const days = args.option("days", "d") || 0;
    if (isNaN(days) || days < 0 || days > 7)
      return message.reply("Days needs to be a valid number between 1 - 7");
    const time = days != 0 ? `\`${days} days\`` : "`Infinite days`";

    const reason = joinTokens(args.many()) || "No Reason Provided";
    const executor = message.author;

    await member.ban({ reason, days });
    message.client.emit("modEvent", "BAN", { member, days, reason, executor });
    return message.reply(
      `Successfully banned **${member.user.tag}** for **${time}** because **${reason}**`
    );
  },
};
