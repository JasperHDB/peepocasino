const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const givecontroller = require("../controllers/givecontroller");
const { UnauthorizedException } = require('../errors/index');
const { BotException } = require("../errors/bot");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('give some peepocoins')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The target user')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount of peepocoins to give')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the gift')),
    async execute(interaction) {
        if (interaction.user.id !== "227505246572642315") return new UnauthorizedException(interaction);

        const embed = new EmbedBuilder()
        const amount = interaction.options.getInteger('amount');
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (user.bot) return new BotException(interaction);

        if (amount < 1) {
            embed
                .setDescription("You cannot donate less than 1 peepocoins")
                .setColor(0xFF0000);
            return await interaction.reply({embeds: [embed]});
        }

        try {
            await usercontroller.addToBalance(user.id, amount)

            const packet = {
                receiver: user.username,
                amount: amount,
                reason: reason
            }

            givecontroller.loggift(packet)

            if (reason) {
                embed
                    .setTitle(`${user.username} was awarded ${amount} peepocoin${amount === 1 ? "" : "s"}!`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor(0x00FF00);
            } else {
                embed
                    .setTitle(`${user.username} was awarded ${amount} peepocoin${amount === 1 ? "" : "s"}!`)
                    .setColor(0x00FF00);
            }

            return await interaction.reply({ embeds: [embed] });
        } catch (error) {
            embed
                .setDescription("An error occured while trying to give peepocoins")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }
    },
};