module.exports = async (client, message) => {
  if (message.author.bot) return;

  const command = await client.lex(message);
  if (!command || !command.cmd) return;

  try {
    command.cmd.execute(message, command.args, command.prefix);
  } catch (e) {
    console.log(e);
  }
};
