const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers to the application'),
    async execute(interaction) {
        const embed = new EmbedBuilder();

        if (await usercontroller.isRegistered(interaction.user.id)) {
            embed.setTitle("You are already registered!");
            embed.setColor(0xFF0000);
        }

        try {
            await usercontroller.register(interaction.user);

            embed.setTitle("You have been registered!");
            embed.setImage("https://media.tenor.com/7frX7x_jJsEAAAAC/pacesigning-paceorg.gif");
            embed.setColor(0x00FF00);
        } catch (e) {
            embed.setTitle("An error occured!");
            embed.setColor(0xFF0000);
        }

        return interaction.reply({ embeds: [embed] });
    },
};