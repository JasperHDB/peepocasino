class UnauthorizedException {
    constructor(interaction) {
        interaction.reply({ content: "You are not authorized to use this command", ephemeral: true });
    }
}

module.exports = { UnauthorizedException }