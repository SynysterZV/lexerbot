const { Sequelize, Op } = require("sequelize");
/*----------NSFWJS REQUIREMENTS-----------------*/
const nsfwjs = require("nsfwjs");
const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");
/*----------------------------------------------*/

const fetch = require("node-fetch");
const crypto = require("crypto");
const numeral = require("numeral");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "tags.sqlite",
});
const Tags = require("../structures/Tags/tag")(sequelize, Sequelize.DataTypes);

module.exports = {
  tags: async (name) => {
    const tag =
      (await Tags.findOne({ where: { name: name } })) ||
      (await Tags.findOne({ where: { aliases: { [Op.substring]: name } } }));
    return tag;
  },

  nsfw: async (message) => {
    if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return false;
    if (!message.attachments.first()?.height && !message.embeds[0]?.url)
      return false;
    const url = message.attachments.first()?.proxyURL || message.embeds[0].url;
    const pic = await axios.get(url, {
      headers: {
        "User-Agent": `DiscordBot ${message.client.user.username}/v1.0.1`,
      },
      responseType: "arraybuffer",
    });

    const model = await nsfwjs.load(`file://./client/nsfwjs/`);

    const image = tf.node.decodeImage(pic.data, 3);
    const predictions = await model.classify(image);
    image.dispose();
    console.log(predictions);

    if (["Porn", "Hentai"].includes(predictions[0].className)) return true;
    else return false;
  },

  toUpper: (string) => string.charAt(0).toUpperCase() + string.slice(1),

  hibp: async (pass) => {
    const shasum = crypto.createHash("sha1");
    shasum.update(pass);
    let digest = shasum.digest("hex");
    const kAnon = digest.substr(0, 5);
    digest = digest.slice(5).toUpperCase();

    const base = `https://api.pwnedpasswords.com`;
    const uri = encodeURI(`${base}/range/${kAnon}`);
    const res = await fetch(uri).then((res) => res.text());

    const passwordList = res.split("\n");
    const password = passwordList.find((f) => f.split(":")[0] == digest);
    if (!password) return false;
    return numeral(password.split(":")[1].split("\r")[0]).format(0, 0);
  },
};
