import { Message } from 'discord.js'
export const help = {
    name: "ping",
    desc: "example"
}

export default (message: Message) => {
    message.channel.send('Pong')
}