const fetch = require("node-fetch");
const fs = require("fs");
const yaml = require("js-yaml");

module.exports = {
  help: {
    name: "test",
    desc: "API TESTS",
    aliases: [],
    category: "admin",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const doc = yaml.load(fs.readFileSync("./test/all_tags.yaml", "utf8"));
    console.log(doc);

    message.channel.send(doc[0].content);
  },
};
