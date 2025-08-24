const config = require('../config/config');

class MenuBuilder {
    constructor(sock) {
        this.sock = sock;
    }

    async sendMainMenu(jid) {
        const sections = [{
            title: "🎯 Menu Utama",
            rows: [
                { title: "🛒 Toko Online", rowId: "main_shop", description: "Lihat produk & order" },
                { title: "💳 Pembayaran", rowId: "main_payment", description: "Metode pembayaran" },
                { title: "📊 Laporan", rowId: "main_report", description: "Laporan penjualan" },
                { title: "👥 Customer Service", rowId: "main_service", description: "Bantuan & support" },
                { title: "⚙️ Pengaturan", rowId: "main_settings", description: "Setting bot" },
                { title: "📱 Contact", rowId: "main_contact", description: "Info kontak" }
            ]
        }];

        await this.sock.sendMessage(jid, {
            text: `*🏪 ${config.botName} - Menu Utama*\n\nSilakan pilih menu di bawah:`,
            footer: config.botName,
            title: "Menu Bisnis",
            buttonText: "Pilih Menu",
            sections: sections
        });
    }

    async sendShopMenu(jid) {
        const sections = [{
            title: "🛒 Toko Online",
            rows: [
                { title: "📦 Daftar Produk", rowId: "shop_products", description: "Lihat semua produk" },
                { title: "🛍️ Keranjang", rowId: "shop_cart", description: "Lihat keranjang belanja" },
                { title: "📋 Pesanan Saya", rowId: "shop_orders", description: "Status pesanan" },
                { title: "🔍 Cari Produk", rowId: "shop_search", description: "Cari produk spesifik" },
                { title: "⭐ Review", rowId: "shop_reviews", description: "Review produk" },
                { title: "🏪 Profil Toko", rowId: "shop_profile", description: "Info toko" }
            ]
        }];

        await this.sock.sendMessage(jid, {
            text: "*🛒 Menu Toko Online*\n\nPilih fitur toko:",
            footer: config.botName,
            title: "Toko Online",
            buttonText: "Pilih Fitur",
            sections: sections
        });
    }

    async sendPaymentMenu(jid) {
        const sections = [{
            title: "💳 Pembayaran",
            rows: [
                { title: "💰 Total Tagihan", rowId: "payment_total", description: "Lihat total bayar" },
                { title: "🏦 Transfer Bank", rowId: "payment_bank", description: "Bank transfer" },
                { title: "💳 Virtual Account", rowId: "payment_va", description: "VA semua bank" },
                { title: "📱 E-Wallet", rowId: "payment_ewallet", description: "GoPay, OVO, DANA" },
                { title: "🔖 Kode Promo", rowId: "payment_promo", description: "Gunakan promo" },
                { title: "📄 Invoice", rowId: "payment_invoice", description: "Generate invoice" }
            ]
        }];

        await this.sock.sendMessage(jid, {
            text: "*💳 Menu Pembayaran*\n\nPilih metode:",
            footer: config.botName,
            title: "Pembayaran",
            buttonText: "Pilih Metode",
            sections: sections
        });
    }

    async sendReportMenu(jid) {
        const sections = [{
            title: "📊 Laporan",
            rows: [
                { title: "📈 Harian", rowId: "report_daily", description: "Penjualan hari ini" },
                { title: "📊 Bulanan", rowId: "report_monthly", description: "Rekap bulanan" },
                { title: "👥 Pelanggan Baru", rowId: "report_customers", description: "Data pelanggan" },
                { title: "⭐ Rating", rowId: "report_ratings", description: "Review produk" },
                { title: "💰 Keuangan", rowId: "report_finance", description: "Laporan keuangan" },
                { title: "📦 Stok", rowId: "report_stock", description: "Laporan stok" }
            ]
        }];

        await this.sock.sendMessage(jid, {
            text: "*📊 Menu Laporan*\n\nPilih jenis laporan:",
            footer: config.botName,
            title: "Laporan Bisnis",
            buttonText: "Pilih Laporan",
            sections: sections
        });
    }

    async sendCSMenu(jid) {
        const sections = [{
            title: "👥 Customer Service",
            rows: [
                { title: "🎫 Buat Tiket", rowId: "service_ticket", description: "Laporkan masalah" },
                { title: "📋 Status Tiket", rowId: "service_status", description: "Cek tiket support" },
                { title: "💬 Live Chat", rowId: "service_chat", description: "Chat dengan CS" },
                { title: "📞 Call Center", rowId: "service_call", description: "Nomor kontak" },
                { title: "📧 Email", rowId: "service_email", description: "Email support" },
                { title: "❓ FAQ", rowId: "service_faq", description: "Pertanyaan umum" }
            ]
        }];

        await this.sock.sendMessage(jid, {
            text: "*👥 Menu Customer Service*\n\nPilih layanan:",
            footer: config.botName,
            title: "Customer Service",
            buttonText: "Pilih Layanan",
            sections: sections
        });
    }
}

module.exports = MenuBuilder;
