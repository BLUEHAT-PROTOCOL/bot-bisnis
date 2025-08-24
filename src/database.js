const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class Database {
    constructor() {
        this.init();
    }

    init() {
        Object.values(config.database).forEach(file => {
            const dir = path.dirname(file);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}));
        });
    }

    get(file) {
        try {
            return JSON.parse(fs.readFileSync(file));
        } catch {
            return {};
        }
    }

    set(file, data) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }

    // Helper methods
    addUser(userId, data = {}) {
        const users = this.get(config.database.users);
        users[userId] = { ...users[userId], ...data, created: Date.now() };
        this.set(config.database.users, users);
    }

    getUser(userId) {
        const users = this.get(config.database.users);
        return users[userId] || null;
    }

    addOrder(orderId, data) {
        const orders = this.get(config.database.orders);
        orders[orderId] = { ...data, created: Date.now() };
        this.set(config.database.orders, orders);
    }

    getOrdersByUser(userId) {
        const orders = this.get(config.database.orders);
        return Object.entries(orders).filter(([id, order]) => order.customerId === userId);
    }
}

module.exports = Database;
