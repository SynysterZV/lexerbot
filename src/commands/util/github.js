const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "github",
    desc: "Displays Github info",
    aliases: ["git"],
    category: "util",
  },
  config: {
    perms: [],
    role: false,
  },
  async execute(message, args) {
    const repo = args.single();
    const commit = args.single();
    if (!repo) return;

    const owner = repo.split("/")[0];
    if (/[a-f0-9]{40}$/i.exec(commit)) {
      const repository = repo.split("/")[1];

      let body;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repository}/commits/${commit}`
        );
        body = await res.json();
      } catch (e) {
        return console.log(e);
      }
      if (!body) {
        return message.reply("Im sorry, i could not find that repo!");
      }
      const embed = new MessageEmbed()
        .setColor(3447003)
        .setAuthor(
          body.author?.login ?? "Unknown",
          body.author?.avatar_url ?? "",
          body.author?.html_url ?? ""
        )
        .setTitle(body.commit.message.split("\n")[0])
        .setURL(body.html_url)
        .setDescription(
          `${body.commit.message
            .replace("\r", "")
            .replace("\n\n", "\n")
            .split("\n")
            .slice(1)
            .join("\n")
            .substring(0, 300)} ...
				`
        )
        .addField(
          "Stats",
          `
                    • Total: ${body.stats.total}
                    • Additions: ${body.stats.additions}
                    • Deletions: ${body.stats.deletions}
                `,
          true
        )
        .addField(
          "Committer",
          body.committer
            ? `• [**${body.committer.login}**](${body.committer.html_url})`
            : "Unknown",
          true
        )
        .setThumbnail(body.author?.avatar_url ?? "")
        .setTimestamp(new Date(body.commit.author.date));

      message.channel.send(embed);
    }
    let repository = repo.split("/")[1];
    if (!repository) return;
    if (!repository.includes("#") && !commit) {
      let body;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repository}`
        );
        body = await res.json();
      } catch (e) {
        return console.log(e);
      }
      if (!body) {
        return message.reply("Im sorry, i could not find that repo!");
      }
      const embed = new MessageEmbed()
        .setAuthor(
          body.owner?.login ?? "Unknown",
          body.owner?.avatar_url ?? "",
          body.owner?.html_url ?? ""
        )
        .setTitle(body.name)
        .setURL(body.html_url)
        .setDescription(body.description || "None")
        .addFields(
          { name: "Watchers", value: body.watchers, inline: true },
          { name: "Forks", value: body.forks_count, inline: true },
          { name: "Language", value: body.language },
          {
            name: "Last Push",
            value: new Date(body.pushed_at).toLocaleString(),
          }
        )
        .setThumbnail(body.owner?.avatar_url ?? "")
        .setFooter("Created")
        .setTimestamp(new Date(body.created_at).toLocaleDateString());

      return message.channel.send(embed);
    }
    [repository] = repository.split("#");
    const num = repo.split("#")[1];
    if (!num) return;
    const query = `
                {
                    repository(owner: "${owner}", name: "${repository}") {
                        name
                        issueOrPullRequest(number: ${num}) {
                            ... on PullRequest {
                                comments {
                                    totalCount
                                }
                                commits(last: 1) {
                                    nodes {
                                        commit {
                                            oid
                                        }
                                    }
                                }
                                author {
                                    avatarUrl
                                    login
                                    url
                                }
                                body
                                labels(first: 10) {
                                    nodes {
                                        name
                                    }
                                }
                                merged
                                number
                                publishedAt
                                state
                                title
                                url
                            }
                            ... on Issue {
                                comments {
                                    totalCount
                                }
                                author {
                                    avatarUrl
                                    login
                                    url
                                }
                                body
                                labels(first: 10) {
                                    nodes {
                                        name
                                    }
                                }
                                number
                                publishedAt
                                state
                                title
                                url
                            }
                        }
                    }
                }
        `;
    let body;
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${message.client.config.keyring.github}`,
        },
        body: JSON.stringify({ query }),
      });
      body = await res.json();
      console.log(body);
    } catch (e) {
      console.log(e);
    }
    if (!body?.data?.repository) {
      return message.channel.send(
        "Im sorry i couldnt find the repo you were looking for"
      );
    }
    const d = body.data.repository.issueOrPullRequest;
    const embed = new MessageEmbed()
      .setColor(d.merged ? 0x9c27b0 : d.state === "OPEN" ? 0x43a047 : 0xef6c00)
      .setAuthor(
        d.author?.login ?? "Unknown",
        d.author?.avatarUrl ?? "",
        d.author?.url ?? ""
      )
      .setTitle(d.title)
      .setURL(d.url)
      .setDescription(`${d.body.substring(0, 500)} ...`)
      .addField("State", d.state, true)
      .addField("Comments", d.comments.totalCount, true)
      .addField(
        "Repo & Number",
        `${body.data.repository.name}#${d.number}`,
        true
      )
      .addField("Type", d.commits ? "PULL REQUEST" : "ISSUE", true)
      .addField(
        "Labels",
        d.labels.nodes.length
          ? d.labels.nodes.map((node) => node.name)
          : "NO LABEL(S)",
        true
      )
      .setThumbnail(d.author?.avatarUrl ?? "")
      .setTimestamp(new Date(d.publishedAt));

    message.channel.send(embed);
  },
};
