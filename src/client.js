const LexerClient = require('./client/client')
const client = new LexerClient(require('./client/config.json'));

process.on('unhandledRejection', e => {
    console.log(e);
})

client.login(client.config.token)
