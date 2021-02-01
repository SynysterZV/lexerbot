module.exports = (client, interaction) => {
  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 3,
      data: {
        content: `Pong! Latency is \`${client.ws.ping}ms\``,
        flags: 1 << 6,
      },
    },
  });
};
