const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const {UnderConstructionException} = require("../errors");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Use the shop')
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('Buy something from the shop')
                .addStringOption(option => option
                    .setName('item')
                    .setDescription('The item to buy')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Bank account', value: "Bank account" }
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all items in the shop')
        ),
    async execute(interaction) {
        return new UnderConstructionException(interaction);

        const embed = new EmbedBuilder()

        await interaction.reply({ embeds: [embed] });
    },
};