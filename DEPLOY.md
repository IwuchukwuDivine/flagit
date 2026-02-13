# Deploying Flagit to a VPS

This guide walks you through deploying Flagit on a free Oracle Cloud VPS (or any Ubuntu VPS).

## Prerequisites

- An Oracle Cloud account (Always Free tier) or any Ubuntu 22.04+ VPS
- SSH access to the server

## 1. Provision the VM

### Oracle Cloud (free)

1. Go to [cloud.oracle.com](https://cloud.oracle.com) and create an account
2. Navigate to **Compute > Instances > Create Instance**
3. Choose **Ubuntu 22.04** as the image
4. Select the **Always Free** eligible shape (VM.Standard.E2.1.Micro — 1 OCPU, 1 GB RAM)
5. Download the SSH key pair or upload your own public key
6. Click **Create**

### Open firewall ports

In Oracle Cloud, ports are blocked by default. Open HTTP and HTTPS:

1. Go to **Networking > Virtual Cloud Networks > your VCN > Security Lists**
2. Add ingress rules for:
   - Port **80** (TCP) from `0.0.0.0/0`
   - Port **443** (TCP) from `0.0.0.0/0`

Also run on the VM itself (Ubuntu firewall):

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

## 2. Install dependencies on the server

SSH into your server:

```bash
ssh ubuntu@<your-server-ip>
```

### Node.js 20 (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### PM2 (process manager)

```bash
npm install -g pm2
```

### Caddy (reverse proxy + automatic HTTPS)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## 3. Deploy the app

### Upload your code

Option A — Git (recommended):

```bash
git clone <your-repo-url> ~/flagit
cd ~/flagit
```

Option B — rsync from your local machine:

```bash
# Run this on your LOCAL machine
rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude prisma/dev.db \
  ./ ubuntu@<your-server-ip>:~/flagit/
```

### Install and build

```bash
cd ~/flagit
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Create the .env file

```bash
cat > .env << 'EOF'
DATABASE_URL="file:./prisma/prod.db"
NODE_ENV="production"
SESSION_SECRET="$(openssl rand -hex 32)"
EOF
```

**Important:** The `SESSION_SECRET` must be a random string. The command above generates one automatically. Do not share or commit this file.

### Initialize the production database

```bash
DATABASE_URL="file:./prisma/prod.db" npx prisma migrate deploy
```

## 4. Start the app with PM2

```bash
pm2 start .output/server/index.mjs --name flagit
pm2 save
pm2 startup
```

Useful PM2 commands:

```bash
pm2 logs flagit       # View logs
pm2 restart flagit    # Restart the app
pm2 stop flagit       # Stop the app
pm2 status            # See running processes
```

## 5. Configure Caddy

### Option A: Using a domain

If you have a domain, point its DNS A record to your server's IP, then:

```bash
sudo tee /etc/caddy/Caddyfile << 'EOF'
yourdomain.com {
    reverse_proxy localhost:3000
}
EOF
sudo systemctl restart caddy
```

Caddy will automatically provision an HTTPS certificate via Let's Encrypt.

### Option B: Using server IP (no domain)

For testing without a domain, use HTTP only:

```bash
sudo tee /etc/caddy/Caddyfile << 'EOF'
:80 {
    reverse_proxy localhost:3000
}
EOF
sudo systemctl restart caddy
```

Then access your app at `http://<your-server-ip>`.

### Option C: Free subdomain via DuckDNS

1. Go to [duckdns.org](https://www.duckdns.org), sign in, create a subdomain (e.g. `flagit.duckdns.org`)
2. Point it to your server IP
3. Use it in the Caddyfile like Option A

## 6. Verify

```bash
# Health check
curl http://localhost:3000/api/health

# Or from outside
curl http://<your-server-ip>/api/health
```

You should see: `{"status":"ok","timestamp":"..."}`

## Updating the app

After pushing new code:

```bash
cd ~/flagit
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart flagit
```

## File uploads

Uploaded images are stored in `public/uploads/` on the server filesystem. This directory persists across restarts. Consider backing it up periodically:

```bash
# Simple backup
tar -czf ~/uploads-backup-$(date +%Y%m%d).tar.gz ~/flagit/public/uploads/
```

## Troubleshooting

| Issue | Fix |
|---|---|
| App won't start | Check `pm2 logs flagit` for errors |
| Can't reach the site | Verify firewall ports 80/443 are open |
| Database errors | Run `npx prisma migrate deploy` |
| Session issues after redeploy | Ensure `SESSION_SECRET` in `.env` hasn't changed |
| Caddy won't start | Check `sudo systemctl status caddy` and `sudo journalctl -u caddy` |
