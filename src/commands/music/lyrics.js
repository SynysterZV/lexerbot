const getSong = require("genius-lyrics-api/lib/getSong");
const Discord = require("discord.js");
const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "lyrics",
    desc: "Looks up lyrics on Genius API",
    aliases: ["lyr"],
    category: "music",
    usage:
      '{ "Artist" }{ Song Name }(Artist needs the quotes around if its more than one word)',
  },
  config: {
    perms: [],
    role: false,
  },

  execute(message, args) {
    let queue;
    const player = message.client.manager.get(message.guild.id);
    if (player) {
      queue = player.queue;
    }

    const client = message.client;
    const TOKEN = client.config.keyring.genius;
    const ARTIST = args.single();
    const TITLE = joinTokens(args.many());

    const options = {
      apiKey: TOKEN,
      title: TITLE,
      artist: ARTIST,
      optimizeQuery: true,
    };

    getSong(options).then((song) => {
      const multiple = 2048;
      let page = 1;

      const end = page * multiple;
      const start = end - multiple;

      const lyrics = song.lyrics.slice(start, end);
      const maxPages = Math.ceil(song.lyrics.length / multiple);
      const embed = new Discord.MessageEmbed()
        .setTitle(`${ARTIST} - ${TITLE}`)
        .setDescription(lyrics)
        .setColor(0xff0000)
        .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

      message.channel.send(embed).then(async (msg) => {
        if (maxPages == 1) return;
        msg.react("⬅️");
        msg.react("➡️");

        const forward = (reaction, user) => {
          return reaction.emoji.name === "➡️" && user.id === message.author.id;
        };
        const backward = (reaction, user) => {
          return reaction.emoji.name === "⬅️" && user.id === message.author.id;
        };

        const backwardcol = msg.createReactionCollector(backward, {
          time: 15000,
        });
        const forwardcol = msg.createReactionCollector(forward, {
          time: 15000,
        });

        backwardcol.on("collect", async () => {
          page = page - 1;
          if (page < 1) return (page = page + 1);
          const endback = page * multiple;
          const startback = endback - multiple;

          const lyricsback = song.lyrics.slice(startback, endback);
          const embedback = new Discord.MessageEmbed()
            .setTitle(`${ARTIST} - ${TITLE}`)
            .setDescription(lyricsback)
            .setColor(0xff0000)
            .setFooter(
              `Page ${page > maxPages ? maxPages : page} of ${maxPages}`
            );

          msg.edit(embedback);

          const userReactions = msg.reactions.cache.filter((reaction) =>
            reaction.users.cache.has(message.author.id)
          );
          try {
            for (const reaction of userReactions.values()) {
              await reaction.users.remove(message.author.id);
            }
          } catch (error) {
            console.error("Failed to remove reactions.");
          }
        });
        forwardcol.on("collect", async () => {
          page = page + 1;
          if (page > maxPages) return (page = page - 1);
          const endnext = page * multiple;
          const startnext = endnext - multiple;

          const lyricsnext = song.lyrics.slice(startnext, endnext);
          const embednext = new Discord.MessageEmbed()
            .setTitle(`${ARTIST} - ${TITLE}`)
            .setDescription(lyricsnext)
            .setColor(0xff0000)
            .setFooter(
              `Page ${page > maxPages ? maxPages : page} of ${maxPages}`
            );

          msg.edit(embednext);

          const userReactions = msg.reactions.cache.filter((reaction) =>
            reaction.users.cache.has(message.author.id)
          );
          try {
            for (const reaction of userReactions.values()) {
              await reaction.users.remove(message.author.id);
            }
          } catch (error) {
            console.error("Failed to remove reactions.");
          }
        });
      });
    });
  },
};
