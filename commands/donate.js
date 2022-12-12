const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const usercontroller = require("../controllers/usercontroller");
const donationcontroller = require("../controllers/donationcontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donate')
        .setDescription('Donate peepocoins to another user')
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount of peepocoins to donate')
            .setRequired(true))
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to donate to')
            .setRequired(true)),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        let donateAmount = interaction.options.getInteger('amount');
        let user = interaction.options.getUser('user');

        if (interaction.user.id === user.id) {
            embed.setTitle('You cannot donate to yourself');
            embed.setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        if (!await usercontroller.isRegistered(user.id)) {
            embed
                .setDescription("That user is not yet registered")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        } else if (!await usercontroller.isRegistered(interaction.user.id)) {
            embed
                .setDescription("You are not yet registered, use \`\`/register\`\` to register")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        const senderBalance = await usercontroller.getUserBalance(interaction.user.id);
        const receiverBalance = await usercontroller.getUserBalance(user.id);

        if (donateAmount < 1) {
            embed
                .setDescription("You cannot donate less than 1 peepocoins")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        } else if (donateAmount > senderBalance) {
            embed
                .setTitle(`You cannot afford to donate ${donateAmount} peepocoin${donateAmount === 1  ? "" : "s"}!`)
                .setDescription(`You currently have ${senderBalance} peepocoins`)
                .setImage("https://media.tenor.com/UbGii9oGosoAAAAM/money-wallet.gif")
                .setColor(0xFF0000);
            return await interaction.reply({ embeds: [embed] });
        }

        try {
            await usercontroller.removeFromBalance(interaction.user.id, donateAmount);
            await usercontroller.addToBalance(user.id, donateAmount);

            donationcontroller.logdonation({
                donor: interaction.user.username,
                donee: user.username,
                amount: donateAmount
            })

            embed
                .setTitle(`You have donated ${donateAmount} peepocoins to ${user.username}!`)
                .setDescription(`How generous!`)
                .setColor(0x00FF00);
        } catch (error) {
            await usercontroller.setBalance(user.id, receiverBalance);
            await usercontroller.setBalance(interaction.user.id, senderBalance);

            embed
                .setTitle(`Something went wrong, that's unfortunate`)
                .setDescription(`No worries, the donation was not processed`)
                .setImage("https://http.cat/500")
                .setColor(0xFF0000);
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};