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

// user aoto reply status (use map later)
let user = {
    kongling520: {
        autoReply: false,
    },
    cynosure_220: {
        autoReply: true,
    },
}

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

    console.log(message.content);
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