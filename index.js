const { Client, Collection, GatewayIntentBits, CommandInteractionOptionResolver} = require('discord.js');
const { BotException } = require('./errors/index');
const loggingcontroller = require("./controllers/loggingcontroller");
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ]
});

module.exports = client;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');

const commandsDirectory = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandsDirectory) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {

    if (!interaction.user.bot) {
        loggingcontroller.logmessage({
            interaction: interaction,
            options: interaction.options.data
        });
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    if (interaction.user.bot) return new BotException(interaction);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN).then();