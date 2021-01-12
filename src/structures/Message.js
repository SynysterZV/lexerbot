const { Structures } = require('discord.js')

Structures.extend('Message', C => class extends C {
     
    constructor(client, data, channel){
        super(client, data, channel)
        this.reactDelete = async (author) => {
            this.react('🗑️')

            const filter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === author.id
        
            this.awaitReactions(filter, { max: 1, time: 30000, errors: ['time']})
                .then((collected) => {
                    this.delete() }).catch((collected) => {
                        if(!channel.guild.me.permissions.has(['MANAGE_MESSAGES'])) return
                        this.reactions.removeAll() 
                    })
        }
    }
})