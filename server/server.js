const express = require('express')
const util = require('./util')
const app = express()
const port = 80

app.use(express.json());

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});

app.get('/docs', util.docs)
app.post('/docs', util.docs)

app.get('/reddit/:sub', util.reddit)

app.route('/')
    .get(async (req, res) => res.redirect('https://discord.com/api/oauth2/authorize?client_id=794917013306081331&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&response_type=code&scope=identify%20email%20guilds'))

app.route('/callback') 
    .get(util.callback)

app.route('/secret')
    .get(async (req, res) => res.redirect(301, 'http://lhohq.info/bob.mp4'))