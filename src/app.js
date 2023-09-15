require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, IntentsBitField, Presence } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ]
});

// user aoto reply status (use map later)
let user = {
    kongling520: {
        autoReply: true,
    },
    cynosure_220: {
        autoReply: true,
    },
}


// get current data
const currentDateTime = new Date().toISOString();
const formattedDateTime = currentDateTime.slice(0, 19).replace(/:/g, '_');

// Create a log file name with the current date
const logFileName = `log_${formattedDateTime}.txt`;
const logFilePath = path.join('./logs', logFileName);

// Create a writable stream to write logs to the file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });


client.on('ready', (bot) => {
    console.log('Ready!');
});

client.on('messageCreate', (message) => {

    if (message.content === 'ping') {
        message.reply('pong');
    }

    // kongling520 auto reply
    const kongling520 = message.guild.members.cache.get('974275277351976990'); // 获取特定用户的成员对象
    if (message.mentions.has('974275277351976990') &&
        !message.author.bot &&
        kongling520.presence?.status === 'dnd' &&
        user.kongling520.autoReply
    ) {
        message.channel.send('coding中 勿扰');
    }

    // cynosure auto reply
    const cynosure = message.guild.members.cache.get('866394271036866612');
    if (message.mentions.has('866394271036866612') &&
        !message.author.bot &&
        cynosure.presence?.status === 'dnd' &&
        user.cynosure_220.autoReply
    ) {
        message.reply('在做数学 勿扰！');
    }

    // log message to file and console
    const logMessage = `[${new Date().toISOString()}]${message.author.username}: ${message.content}\n`;
    logStream.write(logMessage);
    console.log(message.author.username, message.content);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        interaction.reply('pong');
    }

    //change auto reply status
    if (interaction.commandName === 'auto-reply') {
        user[interaction.user.username].autoReply = interaction.options.getBoolean('toggle');
        interaction.reply(`Auto Reply is now ${user[interaction.user.username].autoReply ? 'on' : 'off'}`)
    }
});

client.login(process.env.DISCORD_TOKEN);