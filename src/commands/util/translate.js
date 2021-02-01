const tr = require("googletrans").default;
const { joinTokens } = require("lexure");
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "translate",
    desc: "Translates!",
    aliases: ["t"],
    category: "util",
    usage:
      "{ string to translate | ^ | message id} --t=TO LANGUAGE --f=FROM LANGUAGE",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const regex = new RegExp(
      /<(@(&|!)?|#)[0-9]{17,19}>|(?:<a)(?=:):[A-Za-z]+:[0-9]*>?/g
    );

    const { LANGS } = message.client.constants;
    let to = args.option("to", "t") || "en";
    let from = args.option("from", "f") || "en";
    let query = joinTokens(args.many()).trim();
    if (!query)
      return message.channel.send("You must provide a string or message id!");
    let author = message.author;

    const val = (t, f) => {
      for (const obj of LANGS) {
        const item = Object.values(obj).map((v) => v.toLowerCase());
        if (item.includes(t.toLowerCase())) {
          to = obj;
        }
        if (item.includes(f.toLowerCase())) {
          from = obj;
        }
      }
      if (!to.name || !from.name) return false;
      return {
        to: to.code,
        from: from.code,
      };
    };

    if (query === "^") {
      const res = (
        await message.channel.messages.fetch({ before: message.id, limit: 1 })
      ).first();
      query = res.content;
      author = res.author;
    }
    if (Number(query.split("-")[0])) {
      let msgid = query.split("-");
      msgid = msgid[1] || msgid[0];
      const res = await message.channel.messages
        .fetch(msgid)
        .catch(() => false);
      if (!res) return message.reply("Please provide a valid message id!");
      query = res.content;
      author = res.author;
    }
    query = query.replace(regex, "");

    const tf = val(to, from);
    if (!tf) return message.channel.send("Please provide a valid language!");

    const res = await tr(query, tf);

    const embed = new MessageEmbed()
      .setAuthor(author.tag, author.displayAvatarURL())
      .addFields(
        { name: from.name, value: query },
        { name: to.name, value: res.text }
      );
    message.channel.send(embed);
  },
};
