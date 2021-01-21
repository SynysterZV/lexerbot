const { Sequelize, Op } = require('sequelize')
/*----------NSFWJS REQUIREMENTS-----------------*/
const nsfwjs = require('nsfwjs')
const axios = require('axios')
const tf = require('@tensorflow/tfjs-node')
/*----------------------------------------------*/


const sequelize = new Sequelize('database','username','password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'tags.sqlite'
})
const Tags = require('../structures/Tags/tag')(sequelize, Sequelize.DataTypes)

module.exports = {
    tags: async (name) => {
        const tag = await Tags.findOne({ where: { name: name }}) || await Tags.findOne({ where: { aliases: { [Op.substring]: name }}})
        return tag
    },

    nsfw: async (message) => {
        if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return false
        if (!message.attachments.first()?.height && !message.embeds[0]?.url) return false
        const url = message.attachments.first()?.proxyURL || message.embeds[0].url
        const pic = await axios.get(url, {
            headers: {
                'User-Agent': `DiscordBot ${message.client.user.username}/v1.0.1`
            },
            responseType: 'arraybuffer'
        })

        const model = await nsfwjs.load(`file://./client/nsfwjs/`);
        
        const image = tf.node.decodeImage(pic.data,3)
        const predictions = await model.classify(image)
        image.dispose()
        console.log(predictions)
        
        if(['Porn', 'Hentai'].includes(predictions[0].className)) return true
        else return false
        },
    
    toUpper: string => string.charAt(0).toUpperCase() + string.slice(1)
}