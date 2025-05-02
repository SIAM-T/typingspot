#!/bin/bash

# Replace these variables with your actual values
EC2_HOST="your-ec2-public-dns"
KEY_PATH="path/to/your-key.pem"
PROJECT_PATH="$(pwd)"

# Create the directory on EC2
ssh -i "$KEY_PATH" ubuntu@"$EC2_HOST" "sudo mkdir -p /var/www/typingspot && sudo chown -R ubuntu:ubuntu /var/www/typingspot"

# Transfer files to EC2 (excluding node_modules, .git, etc.)
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude '.env.local' \
  -e "ssh -i $KEY_PATH" \
  "$PROJECT_PATH/" \
  ubuntu@"$EC2_HOST":/var/www/typingspot/

# Set up environment file
echo "Copying .env.local file..."
scp -i "$KEY_PATH" .env.local ubuntu@"$EC2_HOST":/var/www/typingspot/

# SSH into the instance and set up the application
ssh -i "$KEY_PATH" ubuntu@"$EC2_HOST" << 'ENDSSH'
cd /var/www/typingspot

# Install dependencies and build
npm install
npm run build

# Install and setup PM2 if not already done
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Start or restart the application
pm2 delete typingspot 2>/dev/null || true
pm2 start npm --name "typingspot" -- start
pm2 save

echo "Deployment completed!"
ENDSSH 