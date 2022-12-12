const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows your balance')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Select a user (optional)')
            .setRequired(false)),
    async execute(interaction) {
        let user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()

        if (user !== null) {
            if (!await usercontroller.isRegistered(user.id)) {
                embed
                    .setDescription("That user is not registered")
                    .setColor(0xFF0000);
                return await interaction.reply({ embeds: [embed] });
            }

            const balance = await usercontroller.getUserBalance(user.id);

            //embed
                //.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })

            if (balance === 0) {
                embed
                .setDescription(`${user.username} currently has no peepocoins! (how embarrasing)`)
                .setColor(0xFF0000);
            } else {
                embed
                .setDescription(`${user.username} currently has **${balance}** peepocoins!`)
                .setColor(0x00FF00);
            }
            
            await interaction.reply({ embeds: [embed] });
        } else {
            if (!await usercontroller.isRegistered(interaction.user.id)) {
                embed
                    .setDescription("You are not yet registered, use \`\`/register\`\` to register")
                    .setColor(0xFF0000);
                return await interaction.reply({ embeds: [embed] });
            }

            const balance = await usercontroller.getUserBalance(interaction.user.id);

            if (balance === 0) {
                embed
                .setDescription(`You currently have no peepocoins! (how embarrasing)`)
                .setColor(0xFF0000);
            } else {
                embed
                .setDescription(`You currently have **${balance}** peepocoins!`)
                .setColor(0x00FF00);
            }

            await interaction.reply({ embeds: [embed] });
        }
    },
};