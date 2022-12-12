class BotException {
    constructor(interaction) {
        interaction.reply({ content: "Bots are not allowed", ephemeral: true });
    }
}

module.exports = { BotException }