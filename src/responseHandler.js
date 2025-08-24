class ResponseHandler {
    constructor() {
        this.welcomeMessages = [
            "Halo kak! Selamat datang di toko kami 🎉",
            "Hi! Ada yang bisa kami bantu? 😊",
            "Hello! Ketik .menu untuk fitur lengkap 📱",
            "Selamat berbelanja! 🛒"
        ];

        this.helpMessages = [
            "Butuh bantuan? Ketik .help ya kak!",
            "Ada masalah? Hubungi .cs",
            "Info produk? Ketik .produk"
        ];
    }

    getRandomWelcome() {
        return this.welcomeMessages[Math.floor(Math.random() * this.welcomeMessages.length)];
    }

    getRandomHelp() {
        return this.helpMessages[Math.floor(Math.random() * this.helpMessages.length)];
    }

    getProductList() {
        return `*📦 Produk Kami*

1. Kaos Polos Premium - Rp 85.000
2. Hoodie Zipper - Rp 250.000
3. Topi Baseball - Rp 45.000
4. Tote Bag - Rp 75.000
5. Mug Custom - Rp 60.000

Ketik .order [nomor] untuk membeli!`;
    }
}

module.exports = ResponseHandler;
