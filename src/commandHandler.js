const BusinessFeatures = require('./businessFeatures');
const MenuBuilder = require('./menuBuilder');
const config = require('../config/config');

class CommandHandler {
    constructor(sock) {
        this.sock = sock;
        this.business = new BusinessFeatures(sock);
        this.menuBuilder = new MenuBuilder(sock);
    }

    async handle(command, message) {
        const jid = message.key.remoteJid;
        
        switch(command) {
            case 'menu':
                await this.menuBuilder.sendMainMenu(jid);
                break;
            case 'toko':
            case 'shop':
                await this.menuBuilder.sendShopMenu(jid);
                break;
            case 'bayar':
            case 'payment':
                await this.menuBuilder.sendPaymentMenu(jid);
                break;
            case 'laporan':
            case 'report':
                await this.menuBuilder.sendReportMenu(jid);
                break;
            case 'cs':
            case 'help':
                await this.menuBuilder.sendCSMenu(jid);
                break;
            case 'start':
                await this.welcomeMessage(jid);
                break;
            case 'info':
                await this.botInfo(jid);
                break;
            case 'owner':
                await this.ownerInfo(jid);
                break;
            default:
                if (command.startsWith('addcommand')) {
                    await this.addCustomCommand(command, message);
                } else {
                    await this.business.handleFeature(command, message);
                }
        }
    }

    async welcomeMessage(jid) {
        const welcome = `
*🎉 Selamat Datang di ${config.botName}!*

Bot WhatsApp bisnis lengkap dengan 200+ fitur:
✅ Toko online
✅ Pembayaran otomatis
✅ Laporan realtime
✅ Customer service 24/7
✅ Marketing tools

*Mulai sekarang:*
Ketik .menu untuk melihat semua fitur!
        `;
        await this.sock.sendMessage(jid, { text: welcome });
    }

    async botInfo(jid) {
        const info = `
*ℹ️ Info ${config.botName}*

*Fitur Utama:*
- 200+ Tools bisnis
- Sistem pembayaran lengkap
- Laporan penjualan
- Auto reply
- Broadcast system
- Customer support

*Cara pakai:*
.menu - Menu utama
.toko - Toko online
.help - Bantuan

*Developer:* Advanced Bot Team
*Version:* 5.0.0 Termux Edition
        `;
        await this.sock.sendMessage(jid, { text: info });
    }

    async ownerInfo(jid) {
        const owner = `
*👤 Owner Info*

*WhatsApp:* 6281234567890
*Email:* owner@bisnisbot.com
*Support:* support@bisnisbot.com

Untuk custom fitur atau kerjasama,
silakan hubungi owner.
        `;
        await this.sock.sendMessage(jid, { text: owner });
    }

    async addCustomCommand(command, message) {
        if (!config.ownerNumber.includes(message.key.remoteJid)) {
            await this.sock.sendMessage(message.key.remoteJid, { text: "⚠️ Hanya owner yang bisa tambah command!" });
            return;
        }

        const parts = command.split(' ');
        if (parts.length < 3) {
            await this.sock.sendMessage(message.key.remoteJid, { text: "⚠️ Format: .addcommand [nama] [response]" });
            return;
        }

        const commandName = parts[1];
        const response = parts.slice(2).join(' ');

        const customCommands = require('../data/custom_commands.json') || {};
        customCommands[commandName] = response;
        require('fs').writeFileSync('./data/custom_commands.json', JSON.stringify(customCommands, null, 2));

        await this.sock.sendMessage(message.key.remoteJid, { text: `✅ Command .${commandName} berhasil ditambahkan!` });
    }
}

module.exports = CommandHandler;
