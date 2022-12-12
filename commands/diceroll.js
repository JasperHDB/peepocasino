const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const dicecontroller = require("../controllers/dicecontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice')
        .addIntegerOption(option => option
            .setName('type')
            .setDescription('The side of your bet')
            .setRequired(true)
            .addChoices(
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: '4', value: 4 },
                { name: '5', value: 5 },
                { name: '6', value: 6 }
            ))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount to bet')
            .setRequired(true)),
    async execute(interaction) {
        const embed = new EmbedBuilder()

        if (!await usercontroller.isRegistered(interaction.user.id)) {
            embed.setTitle("You are not registered!");
            embed.setDescription("Please register using \`\`/register\`\`");
            embed.setImage("https://media.tenor.com/fiarhIxtD74AAAAd/postal-petition.gif");
            embed.setColor(0xFF0000);
            return interaction.reply({ embeds: [embed] });
        }

        const betType = interaction.options.getInteger('type');
        const betAmount = interaction.options.getInteger('amount');

        const userBalance = await usercontroller.getUserBalance(interaction.user.id);

        if (betAmount <= 0) {
            embed
                .setDescription("You cannot bet less than 1 peepocoins")
                .setColor(0xFF0000);
            return interaction.reply({ embeds: [embed] });
        } else if (betAmount > userBalance) {
            embed
                .setTitle(`You cannot afford to bet ${betAmount} peepocoin${betAmount === 1  ? "" : "s"}!`)
                .setDescription(`You currently have ${userBalance} peepocoins`)
                .setImage("https://media.tenor.com/UbGii9oGosoAAAAM/money-wallet.gif")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        await usercontroller.removeFromBalance(interaction.user.id, betAmount);

        const result = dicecontroller.calculate({
            username : interaction.user.username,
            betAmount : betAmount,
            betType : betType,
        });

        try {
            if (result.winner === "user") {
                await usercontroller.addToBalance(interaction.user.id, betAmount * 6);

                embed
                    .setTitle(`You won ${betAmount * 6} coins!`)
                    .setDescription(`The result was **${result.value}**`)
                    //.setImage(roulettecontroller.getWinningGif())
                    .setColor(0x00FF00);
            } else {
                embed
                    .setTitle(`You lost your bet of ${betAmount} coins :(`)
                    .setDescription(`The result was **${result.value}**`)
                    //.setImage(roulettecontroller.getLosingGif())
                    .setColor(0xFF0000);
            }
        } catch (error) {
            await usercontroller.setBalance(interaction.user.id, userBalance);

            embed
                .setTitle(`Something went wrong, that's unfortunate`)
                .setDescription(`No worries, your bet has been refunded`)
                .setImage("https://http.cat/500")
                .setColor(0xFF0000);
        }

        return interaction.reply({ embeds: [embed] });
    },
};