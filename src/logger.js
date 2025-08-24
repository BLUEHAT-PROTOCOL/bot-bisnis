const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFile = './data/logs.txt';
        this.ensureLogFile();
    }

    ensureLogFile() {
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, '');
        }
    }

    info(message) {
        const timestamp = new Date().toISOString();
        const log = `[INFO] ${timestamp} - ${message}\n`;
        console.log(chalk.blue(log));
        fs.appendFileSync(this.logFile, log);
    }

    error(message) {
        const timestamp = new Date().toISOString();
        const log = `[ERROR] ${timestamp} - ${message}\n`;
        console.log(chalk.red(log));
        fs.appendFileSync(this.logFile, log);
    }

    success(message) {
        const timestamp = new Date().toISOString();
        const log = `[SUCCESS] ${timestamp} - ${message}\n`;
        console.log(chalk.green(log));
        fs.appendFileSync(this.logFile, log);
    }
}

module.exports = Logger;
