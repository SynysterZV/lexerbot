const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "text",
    desc: "Twillio test",
    aliases: [],
    category: "admin",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const { sid, auth, number } = message.client.config.keyring.twilio;
    const client = require("twilio")(sid, auth);
    const num = args.single();
    const m = joinTokens(args.many());

    client.messages
      .create({
        body: m,
        from: number,
        to: num,
      })
      .then((message) => console.log(message))
      .catch((e) => console.log(e));
  },
};
