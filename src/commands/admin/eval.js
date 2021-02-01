const clean = (text) => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};

const { joinTokens } = require("lexure");
const request = require("request-promise");
const tr = require("googletrans").default;
const fetch = require("node-fetch");
const axios = require('axios')
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "eval",
    desc: "Evaluate a command",
    aliases: [],
    category: "admin",
    usage: "{ code }",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    let code;

    const ping = message.client.ws.ping;

    const client = message.client;

    if (message.author.id !== "372516983129767938")
      return (
        message.channel.send("You cannot use this command!") &&
        message.client.log("error", "NON_AUTH_EVAL", `${message.author.tag}`)
      );
    let evaled;

    const c = args.save();

    if (args.single() === "command") {
      const command =
        message.client.commands.get(args.single()) ||
        message.client.commands.find(
          (cmd) => cmd.help.aliases && cmd.help.aliases.includes(args.single())
        );
      if (!command) return message.channel.send("That command doesnt exist!");

      evaled = await command.execute.toString();
    } else {
      try {
        args.restore(c);
        code = joinTokens(args.many())
          .replace(/(^`{1,3}|(?<=```)js)|`{1,3}$/g, "")
          .trim();
        message.client.log("debug", "Evaluate", code);
        evaled = await eval(`( async () => {
                return ${code}
            })()`);
      } catch (err) {
        return message.channel.send(
          `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``
        );
      }
    }

    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled, { depth: 0 });

    evaled = evaled.replace(
      message.client.config.keyring.discord,
      "YOU THOUGHT 🤣"
    );

    let cleanCode = clean(evaled);
    let io = `**Input:**\`\`\`js\n${code}\n\`\`\`**Output:**\`\`\`js\n${cleanCode}\n\`\`\``;

    let embed = new MessageEmbed()
      .setTitle("EVAL")
      .setDescription(io)
      .setTimestamp();

    if (embed.description.length > 2048) {
      return message.channel.send(io, { split: true, code: "js" });
    }

    message.channel.send({
      embed,
    }); /*.then(msg => {
            msg.react('▶️')

            const filter = (reaction , user) => reaction.user === message.author.id && reaction.emoji.name === '▶️'

            msg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] }).then(collected => {
                embed.setDescription(`\`\`\`js\n${moreCode}\`\`\``)

                message.channel.send(embed)
            })
        });*/
  },
};
