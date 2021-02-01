const { Structures, Collection } = require("discord.js");

Structures.extend(
  "GuildMember",
  (C) =>
    class extends C {
      constructor(client, data, guild) {
        super(client, data, guild);
        this.muted = new Collection();
        this.mute = async (message, options) => {
          let role = guild.roles.cache.find((r) => r.name === "Muted");
          this.roles.add(role);

          if (this.muted.get(this.id))
            return message.channel.send("This user is already muted!");

          this.muted.set(this.id, [options?.time, options?.reason ?? "None"]);

          setTimeout(() => {
            this.roles.remove(role);
            this.muted.clear();
          }, options?.time ?? 1000 * 60 * 60 * 24);
        };
      }
    }
);
