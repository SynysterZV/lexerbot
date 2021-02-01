const fetch = require("node-fetch");

module.exports = {
  help: {
    name: "meme",
    desc: "Displays random meme from reddit",
    aliases: ["reddit"],
    category: "fun",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const sub = args.single() || "memes";
    const base = `http://localhost/reddit`
    const uri = encodeURI(`${base}/${sub}`)

    const embed = await (await fetch(uri)).json()
    if(embed.error) return message.channel.send(embed.error)

    message.channel.send({ embed });
  },
};
