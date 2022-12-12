const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const usercontroller = require("../controllers/usercontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily coins'),
    async execute(interaction) {
        const embed = new EmbedBuilder()

        if (!await usercontroller.isRegistered(interaction.user.id)) {
            embed
                .setDescription("You are not yet registered, use \`\`/register\`\` to register")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }
        if (!await usercontroller.canClaimDaily(interaction.user.id)) {
            embed
                .setDescription(`You have already claimed your daily reward, come back tomorrow!`)
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        let reward = await usercontroller.claimDaily(interaction.user.id);

        embed
            .setDescription(`You have received ${reward} peepocoins, come back tomorrow!`)
            .setColor(0x00FF00);
        await interaction.reply({ embeds: [embed] });
    },
};