const fetch = require("node-fetch");
const crypto = require("crypto");

module.exports = {
  help: {
    name: "password",
    desc: "Search your pass word on HIBP",
    aliases: ["pass"],
    category: "util",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const string = args.single();

    const count = await message.client.util.hibp(string);

    if (count) {
      return message.channel.send(
        `This password has been found ${count} times!`
      );
    }
    return message.channel.send(
      "This password hasnt been found in any breaches!"
    );
  },
};
