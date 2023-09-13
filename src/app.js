require('dotenv').config();
const { Client, IntentsBitField, Presence } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ]
});

client.on('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', (message) => {

    if (message.content === 'ping') {
        message.reply('pong');
    }

    // kongling520 auto reply
    if (message.mentions.has('974275277351976990') && !message.author.bot) {
        message.reply(`勿扰，coding中！status:`);

    }

    // cynosure auto reply
    if (message.mentions.has('866394271036866612') && !message.author.bot) {
        message.reply('在做数学 勿扰！');
    }

    // console.log("user:", message.author);
    // console.log("userPresence", message.author.presence);
    // console.log("userStatus:", message.guild.members.cache.get('974275277351976990'));
    console.log("userStatus:", client.user.presence.status);
    // console.log(message);
});
client.login(process.env.DISCORD_TOKEN);