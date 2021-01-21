const Lexer = require('./structures')
const DiscordRPC = require('discord-rpc')
const fetch = require('node-fetch')

const client = new Lexer(require('./client/config.json'));

client.loadAll()

process.on('unhandledRejection', e => {
    client.log('error', 'Unhandled Rejection', e)
})


client.login()

const clientId = '794917013306081331';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });


async function setActivity() {
  if (!rpc) {
    return;
  }
  rpc.setActivity({
    details: `Used in`,
    state: `${client.guilds.cache.size} servers!`,
    largeImageKey: 'snek_small',
    largeImageText: 'BOII',
    buttons: [{ label: 'Invite Me!', url: 'https://synyster.page.link/Eit5'}, { label: 'Join my server!', url: 'http://gg.synyster.org'}],
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();
  client.log('success', 'RPC', 'CONNECTED!')

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

client.rpc = rpc
rpc.login({ clientId }).catch(e => { client.log('error', 'RPC_ERR', e) });
