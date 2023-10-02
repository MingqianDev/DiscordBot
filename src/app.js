require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { Client, IntentsBitField, Presence } = require('discord.js');
const save = require('./save.js');
const getWeather = require('./getWeather.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ]
});

// user aoto reply status (use map later)
// let user = {
//     kongling520: {
//         autoReply: true,
//     },
//     cynosure_220: {
//         autoReply: false,
//         replyRacy: true,//自动回复黄猫猫
//     },
// }

// read config file
const rawData = fs.readFileSync('./config/config.json');
const userMap = new Map(JSON.parse(rawData));

// get current data
const currentDateTime = new Date().toISOString();
const formattedDateTime = currentDateTime.slice(0, 19).replace(/:/g, '_');

// Create a log file name with the current date
const logFileName = `log_${formattedDateTime}.txt`;
const logFilePath = path.join('./logs', logFileName);

// Create a writable stream to write logs to the file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create an event listener to listen for user input
rl.on('line', (input) => {
    //stop server
    if (input.trim() === 'stop') {
        save(userMap);
        process.exit(0);
    } else {
        console.log(` ${input}`);
    }
});

//disable Ctrl+C
console.warn('Ctrl+C is disabled. Use "stop" to quit.');
process.on('SIGINT', () => {
    console.log('Ctrl+C is disabled. Use "stop" to quit.');
});

client.on('ready', (bot) => {
    console.log('Ready!');
});

client.on('messageCreate', (message) => {

    if (message.content === 'ping') {
        message.reply('pong');
    }

    if (!(message.mentions.users.size === 0)) {
        for (const [key, value] of message.mentions.users) {
            const userStatus = message.guild.members.cache.get(key);

            if (message.mentions.has(key) &&
                !message.author.bot &&
                userStatus.presence?.status === 'dnd' &&
                userMap.has(value.username) &&
                userMap.get(value.username).autoReply
            ) {
                message.reply(userMap.get(value.username).replyMessage);
            }
        }
    }

    // // kongling520 auto reply
    // const kongling520 = message.guild.members.cache.get('974275277351976990'); // 获取特定用户的成员对象
    // if (message.mentions.has('974275277351976990') &&
    //     !message.author.bot &&
    //     kongling520.presence?.status === 'dnd' &&
    //     userMap.get('kongling520').autoReply
    // ) {
    //     message.reply(userMap.get('kongling520').replyMessage);
    // }

    // // cynosure auto reply
    // const cynosure = message.guild.members.cache.get('866394271036866612');
    // if (message.mentions.has('866394271036866612') &&
    //     !message.author.bot &&
    //     cynosure.presence?.status === 'dnd' &&
    //     userMap.get('cynosure_220').autoReply
    // ) {
    //     message.reply(userMap.get('cynosure_220').replyMessage);
    // }

    //轰炸黄猫猫
    if (message.author.username === "cynosure_220" && userMap.get('cynosure_220').replyRacy) {
        message.reply("黄猫猫");
    }

    // log message to file and console
    const logMessage = `[${new Date().toISOString()}]${message.author.username}: ${message.content}\n`;
    logStream.write(logMessage);

    console.log(message.author.username, message.content);
    // console.log(message.mentions.users.get('974275277351976990'));
    // console.log();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;


    if (interaction.commandName === 'ping') {
        interaction.reply('pong');
    }

    //auto reply toggle
    if (interaction.commandName === 'auto-reply'
        &&
        interaction.options._hoistedOptions[0].name === 'toggle'
    ) {
        userMap.get(interaction.user.username).autoReply = interaction.options.getBoolean('toggle');
        interaction.reply(`Auto Reply is now ${userMap.get(interaction.user.username).autoReply ? 'on' : 'off'}`)
    }

    //modify auto reply message
    if (interaction.commandName === 'auto-reply'
        &&
        interaction.options._hoistedOptions[0].name === 'modify'
    ) {
        if (userMap.has(interaction.user.username)) {
            const temp = userMap.get(interaction.user.username);
            temp.replyMessage = interaction.options._hoistedOptions[0].value;
            interaction.reply(`Auto Reply Message is now '${temp.replyMessage}'`);
            // interaction.reply(userMap.get(interaction.user.username).replyMessage);
            return;
        } else { 
            // add user to map and modify reply message
            userMap.set(interaction.user.username, {
                id: interaction.user.id,
                autoReply: true,
                replyMessage: interaction.options._hoistedOptions[0].value,
            });
            interaction.reply(`Successfuly added user`);
        }
    }

    //自动回复黄猫猫开关
    if (interaction.commandName === '黄猫猫') {
        userMap.get('cynosure_220').replyRacy = interaction.options.getBoolean('toggle');
        interaction.reply(`Auto 黄猫猫 is now ${userMap.get('cynosure_220').replyRacy ? 'on' : 'off'}`)
    }

    //weather command
    if (interaction.commandName === 'weather') {
        let location;
        // if no city is provided, use default location
        if (interaction.options.getString('city') == null) {
            location = { lat: 43.329479, lon: -79.805277 };
            getWeather.getWeather(location, interaction.options.getString('city'))
                .then(weatherData => {
                    interaction.reply(weatherData);
                })
                .catch(error => {
                    console.error(error);
                    interaction.reply('Error: ' + error);
                });
        } else { //has city provided
            getWeather.getLocation(interaction.options.getString('city'))
                .then(location => {
                    location = { lat: location.lat, lon: location.lon };
                    return getWeather.getWeather(location, interaction.options.getString('city'));
                })
                .then(weatherData => {
                    interaction.reply(weatherData);
                })
                .catch(error => {
                    console.error(error);
                    interaction.reply('Error: ' + error);
                    return;
                });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);