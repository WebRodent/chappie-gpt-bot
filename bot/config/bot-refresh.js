var logger = require('../pkg/logger');
var auth = require('./auth.json');
const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder, Routes } = require('discord.js');

// configure commands available to users
const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('enable').setDescription('Enable Chappie'),
    new SlashCommandBuilder().setName('disable').setDescription('Disable Chappie'),
    new SlashCommandBuilder().setName('model').setDescription('Get Chappie\'s model'),
    new SlashCommandBuilder()
        .setName('setmode')
        .setDescription('Set Chappie\'s mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The mode to use\nAvailable modes: default, sys_admin, juridisk_megler')
                .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(auth.token);

(async () => {
    try {
        // for guild-based commands
        rest.put(Routes.applicationGuildCommands(auth.client_id, auth.guild_id), { body: [] })
            .then(() => console.log('Successfully deleted all guild commands.'))
            .catch(console.error);

        // for global commands
        rest.put(Routes.applicationCommands(auth.client_id), { body: [] })
            .then(() => console.log('Successfully deleted all application commands.'))
            .catch(console.error);
        
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(auth.client_id, auth.guild_id), { body: commands })
            .then((data) => console.log("You installed " + data.length + " commands."))
            .catch((err) => console.log(err));
        console.log('Successfully reloaded application (/) commands.');

    } catch (error) {
        console.error(error);
    }
})();