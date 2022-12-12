const { AttachmentBuilder, SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { UnderConstructionException } = require("../errors");
const path = require('node:path');

const coinflipcontroller = require("../controllers/coincontroller");
const usercontroller = require("../controllers/usercontroller");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('statistics')
        .setDescription('Get some statistics')
        .addSubcommand(subcommand =>
            subcommand
                .setName('coinflips')
                .setDescription('Get the statistics of coinflips')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('users')
                .setDescription('Get the statistics of users')
        ),
    async execute(interaction) {
        return new UnderConstructionException(interaction);
        const embed = new EmbedBuilder()
        let result = {};

        const suzie = new AttachmentBuilder('../peepocasino/public/suzie.png');

        switch (interaction.options.getSubcommand()) {
            case 'coinflips':
                result = await coinflipcontroller.getStatistics();

                const coingif = new AttachmentBuilder('../peepocasino/public/coin.gif');

                console.log(result.totalFlips)

                embed
                    .setColor(0xFFD700)
                    .setTitle('Coinflip statistics')
                    .setDescription('Some statistics of coinflips done on Suziecasino')
                    .setThumbnail('attachment://coin.gif')
                    .addFields(
                        { name: 'Global coinflip statistics', value: `
                            In total **${result.totalFlips}** coinflips have been done:
                            **${result.flipsWonByHouse}** were won by Suzie
                            **${result.flipsWonByUsers}** were won by users
                        `},
                        { name: 'Flips won by Suzie', value: `${result.flipsWonByHouse}`, inline: true },
                        { name: 'Flips won by Users', value: `${result.flipsWonByUsers}`, inline: true },
                        { name: 'Total coins distributed', value: `${result.totalAmount}` },
                        { name: 'Amount won by Suzie', value: `${result.amountWonByHouse}`, inline: true },
                        { name: 'Amount won by Users', value: `${result.amountWonByUsers}`, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Suziecasino', iconURL: 'attachment://suzie.png' });

                await interaction.reply({ embeds: [embed], files: [coingif, suzie] });
                break;
            case 'users':
                return new UnderConstructionException(interaction);
            default:
                return new UnderConstructionException(interaction);
        }
    },
};