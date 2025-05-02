#!/bin/bash

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/typingspot
sudo chown -R ubuntu:ubuntu /var/www/typingspot

# Navigate to app directory
cd /var/www/typingspot

# Clone your repository (using HTTPS with credentials)
git clone https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/yourusername/advanced-typingspot.git .

# Install dependencies
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start npm --name "typingspot" -- start

# Save PM2 process list and configure to start on system startup
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu 