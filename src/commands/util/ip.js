const geoip = require('geoip-lite')

module.exports = {
    help: {
      name: "ip",
      desc: "Lookup an ip",
      aliases: [],
      category: "util",
    },
    config: {
      perms: [],
      role: false,
    },
    execute(message, args) {
        const ip = args.single()
        const ipregex = new RegExp(/\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
        if(!ipregex.test(ip)) return message.reply('Please provide a valid ip')

        const geo = geoip.lookup(ip)
        console.log(geo)
    },
  };
  