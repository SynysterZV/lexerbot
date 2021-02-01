module.exports = {
  help: {
    name: "tldr",
    desc: "Searches commands on TLDR",
    aliases: [],
    category: "util",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const { exec } = require("child_process");
    const command = args.single();

    if (command) {
      exec(`tldr ${command}`, (error, stdout, stderr) => {
        if (error) {
          message.client.log("error", "TLDR_ERR", error);
          return;
        }
        if (stderr) {
          message.client.log("error", "TLDR_ERR", stderr);
        }
        message.channel.send(stdout);
      });
    } else {
      message.reply("You need to supply a command!");
    }
  },
};
