const qs = require("querystring");
const fetch = require("node-fetch");

module.exports = async (client, interaction) => {
  const value = interaction.data.options[0].value;
  let source = interaction.data.options[1]?.value || "stable";
  if (!client.constants.DOCUMENTATION_SOURCES.includes(source))
    return message.channel.send("That source doesnt exist!");
  if (source === "v11")
    source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;

  const queryString = qs.stringify({
    src: source,
    q: value,
    force: false,
    includePrivate: true,
  });
  const embed = await fetch(
    `https://djsdocs.sorta.moe/v2/embed?${queryString}`
  ).then((res) => res.json());

  if (!embed) {
    message.channel.send("No Results!");
  }

  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        embeds: [embed],
      },
    },
  });
};
