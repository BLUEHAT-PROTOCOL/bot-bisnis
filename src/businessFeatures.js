const config = require('../config/config');
const Database = require('./database');

class BusinessFeatures {
    constructor(sock) {
        this.sock = sock;
        this.db = new Database();
        this.features = require('./featuresData');
    }

    async handleFeature(featureName, message) {
        const jid = message.key.remoteJid;
        const methods = {
            // Main features
            shop: this.tokoOnline.bind(this),
            payment: this.pembayaran.bind(this),
            report: this.laporan.bind(this),
            service: this.customerService.bind(this),
            
            // Shop features
            products: this.productList.bind(this),
            cart: this.shoppingCart.bind(this),
            orders: this.myOrders.bind(this),
            search: this.searchProduct.bind(this),
            reviews: this.productReviews.bind(this),
            profile: this.storeProfile.bind(this),
            
            // Payment features
            total: this.totalBill.bind(this),
            bank: this.bankTransfer.bind(this),
            va: this.virtualAccount.bind(this),
            ewallet: this.eWallet.bind(this),
            promo: this.promoCode.bind(this),
            invoice: this.generateInvoice.bind(this),
            
            // Report features
            daily: this.dailySales.bind(this),
            monthly: this.monthlySales.bind(this),
            customers: this.newCustomers.bind(this),
            ratings: this.ratings.bind(this),
            finance: this.financialReport.bind(this),
            stock: this.stockReport.bind(this),
            
            // Service features
            ticket: this.createTicket.bind(this),
            status: this.ticketStatus.bind(this),
            chat: this.liveChat.bind(this),
            call: this.callCenter.bind(this),
            email: this.emailSupport.bind(this),
            faq: this.faqMenu.bind(this)
        };

        if (methods[featureName]) {
            await methods[featureName](message);
        } else {
            await this.genericFeature(featureName, message);
        }
    }

    // Implementasi semua fitur bisnis
    async tokoOnline(message) {
        const text = `
*🛒 Toko Online*

Fitur yang tersedia:
• 📦 Daftar Produk
• 🛍️ Keranjang Belanja
• 📋 Status Pesanan
• 🔍 Cari Produk
• ⭐ Review Produk
• 🏪 Profil Toko

Ketik .produk untuk melihat semua produk!
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async productList(message) {
        const products = {
            "1": { name: "Kaos Polos Premium", price: 85000, stock: 50, category: "Kaos" },
            "2": { name: "Hoodie Zipper", price: 250000, stock: 30, category: "Hoodie" },
            "3": { name: "Topi Baseball", price: 45000, stock: 25, category: "Aksesoris" },
            "4": { name: "Tote Bag Canvas", price: 75000, stock: 40, category: "Tas" },
            "5": { name: "Mug Custom", price: 60000, stock: 35, category: "Aksesoris" }
        };

        let text = "*📦 Daftar Produk*\n\n";
        Object.entries(products).forEach(([id, p]) => {
            text += `*[${id}]* ${p.name}\n`;
            text += `   💰 Rp ${p.price.toLocaleString()}\n`;
            text += `   📦 Stok: ${p.stock} pcs\n`;
            text += `   🏷️ Kategori: ${p.category}\n\n`;
        });
        text += "*Cara order:* Ketik .order [nomor produk]";

        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async shoppingCart(message) {
        const text = `
*🛍️ Keranjang Belanja*

Fitur keranjang akan segera tersedia!
Untuk saat ini, silakan order langsung:
.order [nomor produk] [jumlah]
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async pembayaran(message) {
        const text = `
*💳 Pembayaran*

Metode pembayaran tersedia:
• 💰 Total Tagihan
• 🏦 Transfer Bank (BCA, Mandiri, BNI, BRI)
• 💳 Virtual Account
• 📱 E-Wallet (GoPay, OVO, DANA)
• 🔖 Kode Promo
• 📄 Invoice

Ketik .bank untuk info rekening!
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async bankTransfer(message) {
        const text = `
*🏦 Transfer Bank*

Rekening tujuan:
*BCA:* 1234567890
Atas nama: PT BisnisBot

*Mandiri:* 9876543210
Atas nama: PT BisnisBot

*BNI:* 1122334455
Atas nama: PT BisnisBot

*BRI:* 5566778899
Atas nama: PT BisnisBot

*Note:* Konfirmasi transfer ke .confirm
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async dailySales(message) {
        const text = `
*📈 Penjualan Harian*

📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID')}
💰 *Total Penjualan:* Rp 15.750.000
📊 *Transaksi:* 25 transaksi
⭐ *Produk Terlaris:* Kaos Polos Putih
📈 *Rata-rata:* Rp 630.000/transaksi

Jam sibuk:
08:00-10:00: Rp 2.100.000
10:00-12:00: Rp 3.200.000
14:00-16:00: Rp 4.500.000
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async createTicket(message) {
        const ticketId = "TKT" + Date.now().toString().slice(-6);
        const text = `
*🎫 Tiket Support Dibuat*

Nomor Tiket: ${ticketId}
Status: Menunggu Respon
Waktu: ${new Date().toLocaleString('id-ID')}

Tim support akan merespon dalam 1x24 jam
Simpan nomor tiket Anda!
        `;
        await this.sock.sendMessage(message.key.remoteJid, { text });
    }

    async autoReply(message) {
        const responses = [
            "Halo! Ada yang bisa kami bantu? Ketik .menu untuk fitur lengkap",
            "Terima kasih telah menghubungi kami! Ketik .produk untuk melihat barang",
            "Halo kak! Silakan order dengan ketik .order [nomor produk]",
            "Info pembayaran ketik .bank ya kak!"
        ];
        
        const random = responses[Math.floor(Math.random() * responses.length)];
        await this.sock.sendMessage(message.key.remoteJid, { text: random });
    }

    async genericFeature(featureName, message) {
        await this.sock.sendMessage(message.key.remoteJid, { 
            text: `*Fitur ${featureName}*\n\nFitur ini tersedia! Ketik .menu untuk lihat semua fitur.` 
        });
    }
}

module.exports = BusinessFeatures;
