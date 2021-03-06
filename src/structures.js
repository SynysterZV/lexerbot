const { GuildChannelManager } = require("discord.js");

require("./structures/Message");
require("./structures/GuildMember");
const Lexer = require("./client/client");

GuildChannelManager.prototype.createTicket = async function (
  name,
  message,
  options = {}
) {
  if (message.author.id === message.client.user.id)
    return message.channel.send("The bot cannot have a ticket!");
  const n = name || message.mentions.users.first()?.tag || message.author.tag;
  if (n.length < 1 || n.length > 32)
    return message.channel.send(
      "Your ticket channel name must be between 1 and 32 characters"
    );
  this.create(n, options).then((c) => {
    if (options.parent) c.lockPermissions();
    c.createOverwrite(message.mentions.members.first() || message.member, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    });
    c.createOverwrite(message.guild.id, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: false,
    });
  });

  message.reply("Ticket Successfully Created!");
};

String.prototype.cap = function () {
  const str = this.split(/\s+/);
  const strarray = [];
  for (const string of str) {
    strarray.push(string.charAt(0).toUpperCase() + string.slice(1));
  }
  return strarray.join(" ");
};

Number.prototype.isEven = function () {
  return !(this & 1);
};

module.exports = Lexer;
