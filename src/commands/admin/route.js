const { joinTokens } = require("lexure");

module.exports = {
  help: {
    name: "route",
    desc: "No",
    aliases: [],
    category: "admin",
  },
  config: {
    perms: [],
    role: false,
  },
  execute(message, args) {
    const noop = () => {};
    const methods = ["get", "post", "delete", "patch", "put"];
    const reflectors = [
      "toString",
      "valueOf",
      "inspect",
      "constructor",
      Symbol.toPrimitive,
      Symbol.for("nodejs.util.inspect.custom"),
    ];

    function buildRoute() {
      const route = [""];
      const handler = {
        get(target, name) {
          console.log(route);
          if (reflectors.includes(name)) return () => route.join("/");
          route.push(name);
          return new Proxy(noop, handler);
        },
        apply(target, _, args) {
          route.push(...args.filter((x) => x != null)); // eslint-disable-line eqeqeq
          return new Proxy(noop, handler);
        },
      };
      return new Proxy(noop, handler);
    }

    this.api = buildRoute();
    return message.channel.send(this.api.interactions("155151"));
  },
};
