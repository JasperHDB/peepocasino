const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const coinflipcontroller = require("../controllers/coincontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin')
        .addStringOption(option => option
            .setName('type')
            .setDescription('The side of your bet')
            .setRequired(true)
            .addChoices(
                { name: 'Heads', value: "heads" },
                { name: 'Tails', value: "tails" }
            ))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount to bet')
            .setRequired(true)),
    async execute(interaction) {
        const embed = new EmbedBuilder()

        if (!await usercontroller.isRegistered(interaction.user.id)) {
            console.log("User is not registered");
            embed.setTitle("You are not registered!");
            embed.setDescription("Please register using \`\`/register\`\`");
            embed.setImage("https://media.tenor.com/fiarhIxtD74AAAAd/postal-petition.gif");
            embed.setColor(0xFF0000);
            return interaction.reply({ embeds: [embed] });
        }

        const betType = interaction.options.getString('type');
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

        const result = coinflipcontroller.calculate({
            username : interaction.user.username,
            betAmount : betAmount,
            betType : betType,
        });

        try {
            if (result.winner === "user") {
                await usercontroller.addToBalance(interaction.user.id, betAmount * 2);

                embed
                    .setTitle(`You won ${betAmount * 2} coins!`)
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