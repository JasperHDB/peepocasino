class UnderConstructionException {
    constructor(interaction) {
        interaction.reply({ content: "This command is still in development", ephemeral: true });
    }
}

module.exports = { UnderConstructionException }