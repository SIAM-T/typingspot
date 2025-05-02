# Deploying TypingSpot to AWS EC2 (Amazon Linux 2023)

This guide will walk you through deploying the TypingSpot application to an AWS EC2 instance using Amazon Linux 2023.

## Prerequisites

1. AWS Account
2. GitHub repository with your code
3. Supabase account and credentials
4. Domain name (optional)

## Step 1: Setting up EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
   - Choose "Amazon Linux 2023"
   - Select t2.micro (free tier) or t2.small/medium for better performance
   - Create new key pair (save the .pem file securely)
   - Configure Security Group:
     ```
     HTTP (80)         : 0.0.0.0/0
     HTTPS (443)       : 0.0.0.0/0
     SSH (22)          : Your IP
     Custom TCP (3000) : 0.0.0.0/0
     ```

## Step 2: Connecting to Your Instance

1. Change permissions for your key file:
   ```bash
   chmod 400 your-key.pem
   ```

2. Connect to your instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-public-dns
   ```

## Step 3: Installing Dependencies

Run these commands on your EC2 instance:

```bash
# Switch to root user
sudo su

# Update system packages
yum update -y

# Install development tools
yum groupinstall "Development Tools" -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
yum install -y nodejs

# Install NGINX
yum install nginx -y

# Install Git
yum install git -y

# Install PM2 globally
npm install -g pm2
```

## Step 4: Setting up the Application

1. Create application directory:
   ```bash
   sudo mkdir -p /var/www/typingspot
   sudo chown -R ec2-user:ec2-user /var/www/typingspot
   cd /var/www/typingspot
   ```

2. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/advanced-typingspot.git .
   ```

3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

4. Create .env.local file:
   ```bash
   nano .env.local
   ```
   Add your environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=your_domain_or_ec2_public_ip
   ```

## Step 5: Configuring Nginx

1. Create Nginx configuration:
   ```bash
   sudo nano /etc/nginx/conf.d/typingspot.conf
   ```

2. Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Content-Type-Options "nosniff";
       add_header Referrer-Policy "strict-origin-when-cross-origin";
       add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;";

       # Enable gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 10240;
       gzip_proxied expired no-cache no-store private auth;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
       gzip_disable "MSIE [1-6]\.";
   }
   ```

3. Start and enable Nginx:
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   sudo systemctl status nginx
   ```

## Step 6: Starting the Application

1. Start the application with PM2:
   ```bash
   cd /var/www/typingspot
   pm2 start npm --name "typingspot" -- start
   ```

2. Save PM2 process list and configure startup:
   ```bash
   pm2 save
   sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
   ```

## Step 7: SSL Configuration (Optional but Recommended)

1. Install Certbot:
   ```bash
   sudo yum install certbot python3-certbot-nginx -y
   ```

2. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## Step 8: Updating the Application

To update your application in the future:

```bash
cd /var/www/typingspot
git pull
npm install
npm run build
pm2 restart typingspot
```

## Monitoring and Maintenance

1. View application logs:
   ```bash
   pm2 logs typingspot
   ```

2. Monitor application status:
   ```bash
   pm2 status
   ```

3. View Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## Troubleshooting

1. If Nginx shows 502 Bad Gateway:
   - Check if your application is running: `pm2 status`
   - Check application logs: `pm2 logs typingspot`
   - Verify Nginx configuration: `sudo nginx -t`

2. If SSL certificate isn't working:
   - Check Certbot logs: `sudo certbot certificates`
   - Renew certificate: `sudo certbot renew --dry-run`

3. If application won't start:
   - Check Node.js version: `node -v`
   - Verify environment variables: `nano .env.local`
   - Check disk space: `df -h`

## Security Best Practices

1. Keep your system updated:
   ```bash
   sudo yum update -y
   ```

2. Configure firewall with firewalld:
   ```bash
   sudo yum install firewalld -y
   sudo systemctl start firewalld
   sudo systemctl enable firewalld
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --permanent --add-service=ssh
   sudo firewall-cmd --reload
   ```

3. Set up automatic security updates:
   ```bash
   sudo yum install dnf-automatic -y
   sudo systemctl enable --now dnf-automatic.timer
   ```

## Backup Strategy

1. Database backups are handled by Supabase

2. Application files backup:
   ```bash
   # Create backup directory
   mkdir -p ~/backups

   # Create backup script
   nano ~/backup-app.sh
   ```
   Add this content:
   ```bash
   #!/bin/bash
   BACKUP_DIR=~/backups
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   tar -czf $BACKUP_DIR/typingspot_$TIMESTAMP.tar.gz /var/www/typingspot
   find $BACKUP_DIR -type f -mtime +7 -delete
   ```

3. Make script executable and schedule with cron:
   ```bash
   chmod +x ~/backup-app.sh
   crontab -e
   ```
   Add this line for daily backups:
   ```
   0 0 * * * ~/backup-app.sh
   ```

## SELinux Configuration (Important for Amazon Linux)

If you encounter permission issues, you may need to configure SELinux:

```bash
# Install SELinux tools
sudo yum install policycoreutils-python-utils -y

# Allow Nginx to proxy to Node.js
sudo setsebool -P httpd_can_network_connect 1

# If using custom directories, set proper context
sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/typingspot(/.*)?"
sudo restorecon -Rv /var/www/typingspot
```

## Need Help?

If you encounter any issues during deployment:
1. Check the application logs using `pm2 logs`
2. Check Nginx logs in `/var/log/nginx/`
3. Check SELinux audit logs: `sudo ausearch -m AVC -ts recent`
4. Verify all environment variables are correctly set
5. Ensure Supabase connection is working
6. Check AWS EC2 instance metrics in CloudWatch 