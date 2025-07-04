const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} = require("discord.js");
const fs = require("fs");

// 環境変数から設定を取得
const config = {
    token: process.env.BOT_TOKEN,
    prefix: process.env.BOT_PREFIX,
    owner_id: process.env.OWNER_ID,
    embed_color: process.env.EMBED_COLOR
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});
module.exports = client;

client.commands = new Collection();
client.category = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

// config.jsonの代わりに環境変数から取得したconfigを使用
client.config = config;

const functionFolders = fs.readdirSync("./functions");
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./functions/${folder}`)
        .filter((file) => file.endsWith(".js"));

    for (const file of functionFiles)
        require(`./functions/${folder}/${file}`)(client);
}

require("./distube/index");

client.handleEvents();
client.handleComponents();
client.handleCommands();

// anticrash
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(err, origin);
});

client.login(config.token);
