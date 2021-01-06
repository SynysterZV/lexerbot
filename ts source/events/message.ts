import { Message } from 'discord.js'
import Client from '../client/clientstruct'

export = (client: Client, message: Message) => {
    if (message.author.bot) return

    const command = client.lex(message)
    if(!command || !command.cmd) return;

    try {
    command.cmd(message);
    } catch (e) {
        console.log(e);
    }
}