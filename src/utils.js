const moment = require('moment-timezone');
const config = require('../config/config');

class Utils {
    static formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    static formatDate(date) {
        return moment(date).tz(config.timezone).format('DD MMMM YYYY HH:mm');
    }

    static generateId(prefix = '') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    static isOwner(jid) {
        return config.ownerNumber.includes(jid);
    }

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = Utils;
