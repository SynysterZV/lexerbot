module.exports = async (client, message) => {

    if(message.author.bot) return;
    const nsfw = await message.client.util.nsfw(message)

      if(message.attachments.first() || message.embeds[0]) {
        if(nsfw) return message.delete() && message.channel.send('This content was marked nsfw!')
      }

    const command = await client.lex(message);
    if (!command || !command.cmd) return;

    try {
        command.cmd.execute(message, command.args, command.prefix)
    } catch (e) {
        console.log(e);
    }

}