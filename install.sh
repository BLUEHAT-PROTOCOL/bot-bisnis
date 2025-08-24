#!/bin/bash
echo "🚀 Installing BisnisBot Termux..."

# Update Termux
pkg update && pkg upgrade -y

# Install Node.js
pkg install nodejs-lts -y
pkg install git -y

# Create directories
mkdir -p {config,src,data,sessions}

# Install dependencies
npm install

# Create empty data files
echo "{}" > data/users.json
echo "{}" > data/orders.json
echo "{}" > data/products.json
echo "{}" > data/customers.json
echo "{}" > data/settings.json
echo "{}" > data/custom_commands.json

echo "✅ Installation complete!"
echo "Run: node index.js to start bot"
