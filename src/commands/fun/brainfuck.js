const Brainfuck = require("brainfuck-node");
const brainfuck = new Brainfuck();
const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "brainfuck",
    desc: "Brainfuck interpreter",
    aliases: ["bf"],
    category: "fun",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const command = joinTokens(args.many());

    try {
      let res = brainfuck.execute(command, "Hello world");
      message.channel.send(res.output).catch((e) => false);
    } catch (e) {
      console.log(e);
    }
  },
};
