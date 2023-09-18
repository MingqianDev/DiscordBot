require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")

const command = [
    {
        name: 'ping',
        description: 'Replies with pong'
    },
    {
        name: 'auto-reply',
        description: 'Toggle Auto Reply',
        options: [
            {
                name: 'toggle',
                description: 'Set the status (on/off) of auto reply',
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }
        ]
    },
    {
        name: ' 黄猫猫',
        description: '猫猫每句话后面都有回复黄猫猫',
        options: [
            {
                name: 'toggle',
                description: 'Set the auto reply on/off',
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }
        ]
    },
    {
        name: 'weather',
        description: 'get weather',
        options: [
            {
                name: 'city',
                description: 'enter your city',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'country',
                description: 'enter your country(using ISO 3166 Alpha-2 code)',
                type: ApplicationCommandOptionType.String,
            }
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('registering commands...');

        await rest.put(
            Routes.applicationCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: command },
        );
        console.log('commands registered');

    } catch (error) {
        console.error(error);
    }
})();
