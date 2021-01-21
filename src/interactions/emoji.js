module.exports = (client, interaction) => {
    const value = interaction.data.options[0].value
    if(!(/<?a?:[A-Za-z]+:(?:[0-9]?)+>?/g).test(value)) return;
    console.log(interaction.data.options[0].value)
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 3,
            data: {
                content: `${interaction.data.options[0].value}`,
            }
        }
    })
}