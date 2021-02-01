module.exports = async (client, interaction) => {
  const value = interaction.data.options[0].value;
  const tag = await client.util.tags(value);
  if (!tag) return;
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data: {
        content: `${tag.content}`,
      },
    },
  });
};
