# Backup file lama
cp index.js index.js.backup

# Buat index.js baru dengan fix
cat > index.js << 'EOF'
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

console.log('🚀 Starting BisnisBot Termux...');

class FixedBot {
    constructor() {
        this.sock = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async start() {
        try {
            const { state, saveCreds } = await useMultiFileAuthState('./sessions');
            
            this.sock = makeWASocket({
                version: [2, 2323, 4],
                logger: pino({ level: 'silent' }),
                auth: state,
                browser: ["BisnisBot", "Termux", "1.0"],
                printQRInTerminal: false,
                connectTimeoutMs: 60000, // 60 detik timeout
                defaultQueryTimeoutMs: 60000,
                keepAliveIntervalMs: 30000,
                markOnlineOnConnect: true
            });

            // Handle connection dengan retry
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;
                
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('❌ Connection closed, retrying...', shouldReconnect);
                    
                    if (shouldReconnect && this.retryCount < this.maxRetries) {
                        this.retryCount++;
                        console.log(`🔄 Retry attempt ${this.retryCount}/${this.maxRetries}`);
                        setTimeout(() => this.start(), 5000);
                    }
                } else if (connection === 'open') {
                    console.log('✅ Bot berhasil terhubung!');
                    this.retryCount = 0;
                }
            });

            this.sock.ev.on('creds.update', saveCreds);

            // Handle pairing code dengan timeout
            if (!state.creds.registered) {
                await this.handlePairingCode();
            }

            this.setupMessageHandler();

        } catch (error) {
            console.log('❌ Error starting bot:', error.message);
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying (${this.retryCount}/${this.maxRetries})...`);
                setTimeout(() => this.start(), 5000);
            }
        }
    }

    async handlePairingCode() {
        console.log('🔄 Requesting pairing code...');
        
        try {
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            rl.question('📱 Masukkan nomor WhatsApp (format: 6283131810087): ', async (phoneNumber) => {
                rl.close();
                
                // Validasi format nomor
                if (!phoneNumber.startsWith('62') || phoneNumber.length < 10) {
                    console.log('❌ Format nomor salah! Gunakan format 628xxxxxxxxx');
                    return;
                }

                let retryCount = 0;
                while (retryCount < 3) {
                    try {
                        console.log('⏳ Requesting code...');
                        const code = await this.sock.requestPairingCode(phoneNumber);
                        console.log(`🔗 Kode Pairing: ${code}`);
                        console.log('✅ Masukkan kode di WhatsApp → Settings → Linked Devices');
                        break;
                    } catch (error) {
                        retryCount++;
                        console.log(`❌ Attempt ${retryCount}/3 failed: ${error.message}`);
                        
                        if (retryCount < 3) {
                            console.log('🔄 Retrying in 3 seconds...');
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        } else {
                            console.log('❌ Max retries reached. Please restart.');
                        }
                    }
                }
            });
        } catch (error) {
            console.log('❌ Error requesting pairing code:', error.message);
        }
    }

    setupMessageHandler() {
        this.sock.ev.on('messages.upsert', async (messages) => {
            const m = messages.messages[0];
            if (!m.message || m.key.fromMe) return;

            const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
            const jid = m.key.remoteJid;

            // Commands
            if (text === '.menu') {
                await this.showMenu(jid);
            }

            if (text === '.produk') {
                await this.showProducts(jid);
            }
        });
    }

    async showMenu(jid) {
        await this.sock.sendMessage(jid, {
            text: "*🏪 BisnisBot - Menu Utama*\n\nProduk tersedia:\n1. 📦 Produk Lengkap\n2. 💳 Pembayaran\n3. 📊 Laporan\n4. 👥 Customer Service",
            footer: "BisnisBot Termux",
            title: "Menu Bisnis",
            buttonText: "Pilih Menu",
            sections: [{
                title: "Menu",
                rows: [
                    { title: "📦 Produk", rowId: "products", description: "Lihat semua produk" },
                    { title: "💳 Bayar", rowId: "payment", description: "Info pembayaran" },
                    { title: "📊 Laporan", rowId: "report", description: "Lihat laporan" },
                    { title: "👥 CS", rowId: "support", description: "Bantuan" }
                ]
            }]
        });
    }

    async showProducts(jid) {
        await this.sock.sendMessage(jid, { 
            text: `*📦 Produk Kami*\n\n1. Kaos Polos Premium - Rp 85.000\n2. Hoodie Zipper - Rp 250.000\n3. Topi Baseball - Rp 45.000\n4. Tote Bag - Rp 75.000\n\nOrder: .order [nomor]\nBayar: .bayar\nMenu: .menu` 
        });
    }
}

// Start dengan banner
console.log(`
╔══════════════════════════════════════╗
║         BISNISBOT TERMUX v5.0        ║
║    🔧 FIXED - NO CONNECTION ERROR    ║
║    ✅ Pairing Code Support           ║
╚══════════════════════════════════════╝
`);

const bot = new FixedBot();
bot.start();
EOF
