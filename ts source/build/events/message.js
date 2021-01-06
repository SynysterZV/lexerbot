"use strict";
module.exports = (client, message) => {
    if (message.author.bot)
        return;
    const command = client.lex(message);
    if (!command || !command.cmd)
        return;
    try {
        command.cmd(message);
    }
    catch (e) {
        console.log(e);
    }
};
