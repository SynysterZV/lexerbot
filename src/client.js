const LexureClient = require('./structures')
const { MessageEmbed } = require('discord.js')
const { Manager } = require('erela.js')
const DiscordRPC = require('discord-rpc')

const client = new LexureClient(require('./client/config.json'));

client.manager = new Manager({
  nodes: client.erdata.nodes,
  plugins: client.erdata.plugins,
  send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
  }
})
.on('nodeConnect', node => console.log("\x1b[36m",`Node ${node.options.identifier} connected`,"\x1b[0m"))
.on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} has had an error ${error}`))
.on('trackStart', (player, track) => {
  const guild = client.guilds.cache.get(player.guild);
  const req = guild.member(track.requester);
  const embed = new MessageEmbed()
      .setTitle('» Now Playing: ')
      .setDescription(`[${track.title}](${track.uri})`)
      .setAuthor(req.user.tag, req.user.displayAvatarURL())
      .setFooter(guild, guild.iconURL())
      .setTimestamp()
      .setThumbnail(track.thumbnail);
  if(track.uri !== 'https://www.youtube.com/watch?v=Q-tH0olciZU') {
  client.channels.cache.get(player.textChannel).send(embed).then(m => m.delete({ timeout: 10000 }));
}
else {return;}
})
.on('queueEnd', (player) => {
  client.channels.cache
      .get (player.textChannel)
      .send('Queue has ended.');

  player.destroy();
})
.on('playerMove', (player, currentChannel, newChannel) => {
  player.voiceChannel = client.channels.cache.get(newChannel);
});

client.on('raw', (d) => client.manager.updateVoiceState(d));

process.on('unhandledRejection', e => {
    console.log(e);
})


client.login()

const clientId = '794917013306081331';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });


async function setActivity() {
  if (!rpc) {
    return;
  }

  rpc.setActivity({
    details: 'I am a fairly new bot,',
    state: 'but ill do.',
    largeImageKey: 'snek_small',
    largeImageText: 'BOII',
    buttons: [{ label: 'Invite Me!', url: 'https://synyster.page.link/Eit5'}, { label: 'Join my server!', url: 'http://gg.synyster.org'}],
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();
  console.log('RPC Connected!')

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(e => {
    console.log(e)
    if(e === 'RPC_CONNECITON_TIMEOUT') {
        console.log('Ha')
    }
});
