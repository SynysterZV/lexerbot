module.exports = async (client, message) => {
    if(message.author.bot) return;

    const command = client.lex(message);
    if (!command || !command.cmd) return;

    try {
        command.cmd.execute(message, command.args)
    } catch (e) {
        console.log(e);
    }

}