const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const tr = require("googletrans").default;

module.exports = {
  help: {
    name: "dictionary",
    desc: "Looks up on the google dictionary",
    aliases: ["dict"],
    category: "util",
    usage: "{ word } --l=LANGUAGE",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const { LANGS } = message.client.constants;
    let l = args.option("lang", "l") || "en";

    for (const lang of LANGS) {
      const item = Object.values(lang).map((v) => v.toLowerCase());
      if (item.includes(l)) {
        l = { lang: lang.code, changed: true };
      }
    }

    if (!l.changed)
      return message.reply(
        "That language either doesnt exist or is not supported!"
      );

    const uri = encodeURI(
      `https://api.dictionaryapi.dev/api/v2/entries/${l.lang}/${args.single()}`
    );
    const res = await fetch(uri).then((res) => res.json());
    if (!res[0]?.word)
      return message.channel.send("We couldnt find that word!");

    const gd = await tr(["Google Dictionary", "Example"], {
      to: l.lang,
      from: "en",
    });

    const embed = new MessageEmbed()
      .setAuthor(
        `${gd.textArray[0]} - ${res[0].word.cap()}`,
        "https://cdn4.iconfinder.com/data/icons/social-media-and-logos-11/32/Logo_Google-512.png"
      )
      .setColor("BLUE");

    for (const i of res[0].meanings) {
      embed.addField(`\u200b`, `» **__${i.partOfSpeech.cap()}__**`);
      const defs = i.definitions.splice(0, 2);
      for (const def of defs) {
        embed.addField(
          `- ${def.definition}`,
          `${gd.textArray[1]}: *${def.example || "None"}*`
        );
      }
    }

    message.channel.send(embed);
  },
};
