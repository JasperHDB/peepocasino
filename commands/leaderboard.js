const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { UnderConstructionException } = require("../errors");

const usercontroller = require("../controllers/usercontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the leaderboard'),
    async execute(interaction) {
        const result = await usercontroller.getLeaderBoard();
        const embed = new EmbedBuilder()

        embed
            .setColor(0xFFD700)
            .setTitle('The leaderboard of Suziecasino')
            .addFields(
                { name: `:first_place: ${result[0].username}`, value: `${result[0].balance.toLocaleString()} peepocoins` },
                { name: `:second_place: ${result[1].username}`, value: `${result[1].balance.toLocaleString()} peepocoins` },
                { name: `:third_place: ${result[2].username}`, value: `${result[2].balance.toLocaleString()} peepocoins` },
                { name: `:medal: ${result[3].username}`, value: `${result[3].balance.toLocaleString()} peepocoins` },
                { name: `:medal: ${result[4].username}`, value: `${result[4].balance.toLocaleString()} peepocoins` },
            )

        return await interaction.reply({ embeds: [embed] });
    },
};