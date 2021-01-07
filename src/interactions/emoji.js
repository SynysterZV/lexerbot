module.exports = (client, interaction) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 3,
            data: {
                content: `${interaction.data.options[0].value}`,
                flags: 1<<6
            }
        }
    })
}