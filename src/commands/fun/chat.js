const fetch = require("node-fetch");
const { joinTokens } = require("lexure");

const chat = async (msg, id) => {
  const base = `https://api.udit.gq/api`;
  const uri = encodeURI(
    `${base}/chatbot?message=${msg}&name=Chatbot&user=${id}&gender=male`
  );
  const res = await fetch(uri).then((res) => res.json());
  if (!res.message) return false;
  return res.message;
};

module.exports = {
  help: {
    name: "chat",
    desc: "Chatbot API",
    aliases: [],
    category: "fun",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const mes = await chat(
      joinTokens(args.many()) || "Hello!",
      message.author.id
    );

    message.channel.send(mes).then(() => {
      const filter = (m) => message.author.id === m.author.id;

      const collector = message.channel.createMessageCollector(filter, {
        time: 15000,
      });

      collector.on("collect", async (m) => {
        if (m.content == "end") return collector.stop("end");
        const newMes = await chat(m.content, m.author.id);
        message.channel.send(newMes);
        collector.resetTimer();
      });

      collector.on("end", () => message.channel.send("Thanks for chatting!"));
    });
  },
};

// /api/chatbot?message=MESSAGE[&name=BOT_NAME&user=MESSAGE_AUTHOR_ID&gender=GENDER]
