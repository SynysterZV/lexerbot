const fetch = require("node-fetch");
const convert = require("xml-js");
const { joinTokens } = require("lexure");
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "wolfram",
    desc: "command using WOLFRAM API",
    aliases: ["wolf"],
    category: "util",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    let dataAsJson = {};
    const APPID = message.client.config.keyring.wolfram;
    const baseurl = `http://api.wolframalpha.com/v2/`;
    const input = joinTokens(args.many());
    const query = `${baseurl}query?input=${input}&appid=${APPID}`;

    await fetch(query)
      .then((res) => res.text())
      .then((str) => {
        dataAsJson = JSON.parse(convert.xml2json(str));
      });

    let embed = new MessageEmbed();

    const pods = dataAsJson.elements[0].elements;

    const titles = pods
      .map((p) => p.attributes.title)
      .filter((p) => p != undefined)
      .slice(1)
      .join("\n");

    const inp = pods[0].elements[0].elements[1].elements[0].text;

    embed.setDescription(titles);
    embed.setTitle("What would you like to see?");
    embed.addField("Input", inp);

    message.channel.send(embed).then(() => {
      const filter = (m) => m.author.id == message.author.id;

      message.channel
        .awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
        .then((collected) => {
          const subpod = pods.filter(
            (p) => p.attributes.title == collected.first().content
          )[0].elements[0].elements;
          console.log(subpod);
          const img = subpod.filter((s) => s.name == "img")[0].attributes;
          embed.setDescription(img.title);
          embed.setTitle(collected.first().content);
          message.channel.send(embed);
        });
    });
  },
};
