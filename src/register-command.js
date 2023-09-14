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
        options:[
            {
                name: 'toggle',
                description: 'Set the status (on/off) of auto reply',
                type: ApplicationCommandOptionType.Boolean,
                required: true,
            }
        ]
    },
    // {
    //     name: 'hi',
    //     description: 'Replies with hey',
    // },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try{
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
