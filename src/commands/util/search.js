const fetch = require("node-fetch");
const qs = require("querystring");
const { joinTokens } = require("lexure");
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "search",
    desc: "Searches using Google:tm: api",
    aliases: [],
    category: "util",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const { cx, key } = message.client.config.keyring.google;
    const base = `https://www.googleapis.com/customsearch/v1`;
    const query = joinTokens(args.many());
    const querystring = qs.stringify({ cx, key, num: 4, q: query });
    const uri = `${base}?${querystring}`;

    const res = (await (await fetch(uri)).json()).items;

    const fields = res.map(
      (item) => `[**${item.title}**](${item.link})\n${item.snippet}\n\n`
    );

    const embed = new MessageEmbed().setAuthor(
      `Google Search - ${query}`,
      "https://i.imgur.com/BRDflu3.png"
    );
    fields.forEach((field) => embed.addField("\u200b", field));

    message.channel.send(embed);
  },
};
