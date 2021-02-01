const fetch = require('node-fetch')
const path = require('path')
const constants = require('./constants')

module.exports = {

    docs: async (req, res) => {
        if(req.body) console.log(req.body)
        const { src, q, force, includePrivate } = req.query
        if(!q) return res.json({ error: 'You need to provide a search term!'})
        let source

        if(src && !constants.DOCUMENTATION_SOURCES.includes(src)) return res.json({ error: 'That documentation source doesn\'t exist!'})
        src == 'v11' 
            ? source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${src}.json` 
            : source = src

        const query = module.exports.qs({ src: source || 'stable' , q, force, includePrivate })
        if(!query) res.json({ error: 'The query was somehow not formatted correctly' })

        const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?${query}`).then(res=>res.json())
        if(!response) return res.json({ error: 'No docs found!'})

        return res.json(response)
    },

    reddit: async (req, res) => {
        const base = 'https://reddit.com/r'
        const sub = req.params.sub
        if(!sub) return res.json({ error: 'You need to provide a subreddit!'})

        const uri = encodeURI(`${base}/${sub}/random/.json`)

        const response = await fetch(uri).then(res=>res.json())
        if (!response[0]) return res.json({ error: 'I could not find that subreddit!'})

        const body = response[0].data.children[0].data;
        const {
        title,
        subreddit_name_prefixed,
        ups,
        downs,
        num_comments,
        url,
        created_utc,
        is_video,
        media,
        selftext,
        } = body;

        const embed = {
            color: 0xff6347,
            title: subreddit_name_prefixed,
            description: `${title}\n[View Thread](${url})`,
            footer: {
                text: `${downs > 0 ? `👎 ${downs}` : `👍 ${ups}`} 💬 ${num_comments}`
            },
            timestamp: new Date(created_utc * 1000),
            image: {}
        }

        if(!is_video) {
            embed.image.url = url
        }

        if(!media) {
            embed.description += `\n\n${selftext}`
        }

        res.json(embed)
    },

    callback: async (req, res) => {
        const { code } = req.query
        if(!code) res.json({ error: 'No OAuth token provided!' })

        const { access_token, token_type } = await module.exports.exchange_code(code)

        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        })
            .then(res => res.json())

        res.json(response)
    
    },






    qs: (params) => {
        if(typeof params !== 'object') return;
        let query = ''
        for (const i in params) {
            if(params[i] == undefined) continue
            query += `${i}=${params[i] == '' ? true : params[i]}&`
        }
        query = query.slice(0, -1)
        return query
    },

    exchange_code: async (code) => {
        const data = {
            client_id: '794917013306081331',
            client_secret: 'kIEVgLGRotQRIM_oIT11JwnZVSWDrP6v',
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost/callback',
            code,
            scope: 'identify email guilds'
        }

        const { access_token, token_type } = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())

        return { access_token, token_type }
    },

    path
}