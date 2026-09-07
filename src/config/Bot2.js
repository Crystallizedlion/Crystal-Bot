const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// 👇 REPLACE THESE VALUES!
const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = 'YOUR_APPLICATION_ID_HERE';
const BOOST_ROLE_ID = 'ROLE_ID_HERE'; // Optional — leave empty string if you don't want one

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Define the /boost command
const commands = [
    new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Boost the server! ❤️')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    try {
        console.log('🔄 Registering /boost command...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('✅ Command ready! Type /boost in your server!');
    } catch (err) {
        console.error('❌ Error:', err);
    }
});

// Handle the /boost command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'boost') {
        const member = interaction.member;

        // Give role if set
        if (BOOST_ROLE_ID) {
            try {
                await member.roles.add(BOOST_ROLE_ID);
            } catch (e) {
                console.log('⚠️ Could not give role — check permissions!');
            }
        }

        await interaction.reply({
            content: `🎉 **Thank you for boosting the server, ${member.user.username}!**\n\nYour support means the world to us! ❤️\n*(Note: This is a fun command — actual Server Boosts require Discord Nitro)*`,
            allowedMentions: { users: [member.id] }
        });
    }
});

client.login(TOKEN);
