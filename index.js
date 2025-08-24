const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

// Import modules
const config = require('./config/config');
const Database = require('./src/database');
const CommandHandler = require('./src/commandHandler');
const BusinessFeatures = require('./src/businessFeatures');
const MenuBuilder = require('./src/menuBuilder');

// Initialize database
const db = new Database();

class TermuxBot {
    constructor() {
        this.sock = null;
        this.commandHandler = null;
        this.business = null;
        this.menuBuilder = null;
    }

    async start() {
        console.log(chalk.green.bold('🚀 Starting BisnisBot Termux...'));
        
        const { state, saveCreds } = await useMultiFileAuthState('./sessions');
        const { version } = await import('@whiskeysockets/baileys');

        this.sock = makeWASocket({
            version: version,
            logger: pino({ level: 'silent' }),
            auth: state,
            browser: ["BisnisBot", "Termux", "1.0"],
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true
        });

        // Initialize modules
        this.commandHandler = new CommandHandler(this.sock);
        this.business = new BusinessFeatures(this.sock);
        this.menuBuilder = new MenuBuilder(this.sock);

        // Handle pairing code
        if (!state.creds.registered) {
            await this.requestPairingCode();
        }

        // Event handlers
        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
        this.sock.ev.on('messages.upsert', this.handleMessages.bind(this));
    }

    async requestPairingCode() {
        const phoneNumber = await this.askQuestion(chalk.yellow('📱 Masukkan nomor WhatsApp (contoh: 6281234567890): '));
        const code = await this.sock.requestPairingCode(phoneNumber);
        console.log(chalk.green.bold(`🔗 Kode Pairing: ${code}`));
    }

    askQuestion(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => {
            rl.question(question, answer => {
                rl.close();
                resolve(answer);
            });
        });
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('❌ Koneksi terputus:', shouldReconnect ? 'Reconnecting...' : 'Logged out'));
            
            if (shouldReconnect) {
                setTimeout(() => this.start(), 5000);
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Bot berhasil terhubung!'));
        }
    }

    async handleMessages(messages) {
        const m = messages.messages[0];
        if (!m.message || m.key.fromMe) return;

        const messageText = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const command = messageText.toLowerCase().trim();
        const sender = m.key.remoteJid;

        // Handle button/list responses
        if (m.message.listResponseMessage) {
            const selectedId = m.message.listResponseMessage.singleSelectReply.selectedRowId;
            await this.handleMenuSelection(selectedId, m);
            return;
        }

        if (m.message.buttonsResponseMessage) {
            const selectedId = m.message.buttonsResponseMessage.selectedButtonId;
            await this.handleMenuSelection(selectedId, m);
            return;
        }

        // Handle commands
        if (command.startsWith(config.prefix)) {
            await this.commandHandler.handle(command.slice(1), m);
        }

        // Auto reply
        if (!command.startsWith(config.prefix)) {
            await this.business.autoReply(m);
        }
    }

    async handleMenuSelection(selectedId, message) {
        const [type, feature] = selectedId.split('_');
        
        switch(type) {
            case 'main':
                await this.business.handleFeature(feature, message);
                break;
            case 'shop':
                await this.business.handleFeature(feature, message);
                break;
            case 'payment':
                await this.business.handleFeature(feature, message);
                break;
            case 'report':
                await this.business.handleFeature(feature, message);
                break;
            case 'service':
                await this.business.handleFeature(feature, message);
                break;
        }
    }
}

// Start bot
const bot = new TermuxBot();
bot.start();

// Welcome banner
console.log(`
${chalk.cyan.bold('╔══════════════════════════════════════╗')}
${chalk.cyan.bold('║')}         ${chalk.yellow.bold('BISNISBOT TERMUX')}          ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')}    ${chalk.green.bold('200+ Fitur Bisnis Lengkap')}      ${chalk.cyan.bold('║')}
${chalk.cyan.bold('║')}    ${chalk.blue.bold('Pairing Code Support')}            ${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚══════════════════════════════════════╝')}
${chalk.magenta('📁 Folder: /sdcard/Download/BOT-bisnis')}
${chalk.green('🚀 Bot siap dijalankan...')}
`);
