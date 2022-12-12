const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const roulettecontroller = require("../controllers/roulettecontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setDescription('Play european roulette')
        .addStringOption(option => option
            .setName('type')
            .setDescription('The type of your bet')
            .setRequired(true)
            .addChoices(
                { name: 'Even numbers (1 to 1)', value: "even" },
                { name: 'Odd numbers (1 to 1)', value: "odd" },
                { name: 'Black numbers (1 to 1)', value: "black" },
                { name: 'Red numbers (1 to 1)', value: "red" },
                { name: 'Green number (36 to 1)', value: "green" },
            ))
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount to bet')
            .setRequired(true)),
    async execute(interaction) {
        const embed = new EmbedBuilder()

        embed
            .setTitle("This command is currently disabled")
            .setColor(0xFF0000);
        return await interaction.reply({ embeds: [embed] });



        const type = interaction.options.getString('type');
        const betAmount = interaction.options.getInteger('amount');

        if (!await usercontroller.isRegistered(interaction.user.id)) {
            console.log("User is not registered");
            embed.setTitle("You are not registered!");
            embed.setDescription("Please register using \`\`/register\`\`");
            embed.setImage("https://media.tenor.com/fiarhIxtD74AAAAd/postal-petition.gif");
            embed.setColor(0xFF0000);
            return interaction.reply({ embeds: [embed] });
        }

        const userBalance = await usercontroller.getUserBalance(interaction.user.id);

        if (betAmount <= 0) {
            embed
                .setDescription("You cannot bet a negative betAmount")
                .setColor(0xFF0000);
            return interaction.reply({ embeds: [embed] });
        } else if (betAmount > userBalance) {
            embed
                .setTitle("You cannot afford this bet!")
                .setDescription(`${betAmount} is a lot of peepocoins, you currently have ${userBalance}`)
                .setImage("https://media.tenor.com/UbGii9oGosoAAAAM/money-wallet.gif")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        const waitembed = new EmbedBuilder()
            .setTitle("Rolling...")
            .setImage(roulettecontroller.getRollGifs())
            .setColor(0xFFA500);

        const result = roulettecontroller.roll();
        const won = roulettecontroller.checkWin(type, result);

        await usercontroller.removeFromBalance(interaction.user.id, betAmount);

        try {
            if (won) {
                let wonAmount = 0;
                if (type === "green") wonAmount =  betAmount + (betAmount * 35);
                else wonAmount = betAmount * 2;

                await usercontroller.addToBalance(interaction.user.id, wonAmount);

                embed
                    .setTitle(`You won ${wonAmount - betAmount} coins!`)
                    .setDescription(`The result was a **${result.colour} ${result.value}**`)
                    .setImage(roulettecontroller.getWinningGif())
                    .setColor(0x00FF00);
            } else {
                embed
                    .setTitle(`You lost your bet of ${betAmount} coins :(`)
                    .setDescription(`The result was a **${result.colour} ${result.value}**`)
                    .setImage(roulettecontroller.getLosingGif())
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

        return await interaction.reply({ embeds: [waitembed] }).then(
            setTimeout(() => {
                interaction.editReply({ embeds: [embed] })
            }, 3500)
        );
    },
};