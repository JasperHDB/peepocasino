const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const workcontroller = require("../controllers/workcontroller");
const usercontroller = require("../controllers/usercontroller");
const { UnderConstructionException } = require("../errors/index");
const {work} = require("../controllers/workcontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Do some work and earn some peepocoins'),
    async execute(interaction) {
        const embed = new EmbedBuilder()

        const workResult = await workcontroller.work(interaction.user.id);

        if (workResult.success) {
            embed.setTitle(workResult.job);
            embed.setDescription(`You earned **${workResult.amount}** peepocoins!`);
            embed.setColor(0x00FF00);
        } else {
            const remaining_time = await workcontroller.getRemainingDuration(interaction.user.id);
            embed.setTitle("You can't work yet!");
            embed.setDescription(`You can work again at **${remaining_time}**`);
            embed.setColor(0xFF0000);
        }

        await interaction.reply({ embeds: [embed] });
    },
};