module.exports = async (client, oldMessage, newMessage) => {
  const ocom = client.lex(oldMessage);
  const ncom = client.lex(newMessage);

  if (!ncom?.cmd) return;

  if (ocom?.cmd && ncom?.cmd) {
    try {
      await oldMessage.channel.messages.cache
        .find((m) => m.author.id === client.user.id)
        ?.delete();
    } catch (e) {
      console.log(e);
    }
    ncom.cmd.execute(newMessage, ncom.args);
  }

  try {
    ncom.cmd.execute(newMessage, ncom.args);
  } catch (e) {
    console.log(e);
  }
};
