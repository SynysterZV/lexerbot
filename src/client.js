const LexerClient = require('./client/client')
const client = new LexerClient(require('./client/config.json'));

process.on('unhandledRejection', e => {
    console.log(e);
})

client.login(client.config.token)

const DiscordRPC = require('discord-rpc')
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
    buttons: [{ label: 'Invite Me!', url: 'https://synyster.org'}, { label: 'Join my server!', url: 'http://gg.synyster.org'}],
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
