const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const robcontroller = require("../controllers/robcontroller");
const { UnderConstructionException } = require("../errors/index");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Try to rob someone, has a low chance of success!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The target to rob')
            .setRequired(true)),
    async execute(interaction) {
        return new UnderConstructionException(interaction);
        const embed = new EmbedBuilder()

        await interaction.reply({ embeds: [embed] });
    },
};