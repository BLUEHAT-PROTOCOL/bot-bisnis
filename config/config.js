module.exports = {
    botName: "BisnisBot Termux",
    ownerNumber: ["6283131810087@s.whatsapp.net"],
    prefix: ".",
    sessionName: "termux_session",
    timezone: "Asia/Jakarta",
    database: {
        users: "./data/users.json",
        groups: "./data/groups.json",
        settings: "./data/settings.json",
        products: "./data/products.json",
        orders: "./data/orders.json",
        customers: "./data/customers.json"
    },
    apikeys: {
        openai: "sk-your-key",
        xcoder: "your-key",
        removebg: "your-key"
    }
};
