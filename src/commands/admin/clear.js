module.exports = {
  help: {
    name: "clear",
    desc: "Clears {x} amount of messages!",
    aliases: ["c"],
    category: "admin",
    usage: "{ amount }",
  },
  config: {
    perms: ["MANAGE_MESSAGES"],
    role: false,
  },
  async execute(message, args) {
    const amount = args.single() ?? 5;
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.channel.send(
        "You need to provide a valid number between 1 and 100!"
      );
    await message.channel.messages
      .fetch({ limit: amount })
      .then((m) => message.channel.bulkDelete(m, true))
      .catch((e) => console.log(e));
  },
};
