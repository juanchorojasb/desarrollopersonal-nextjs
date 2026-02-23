# Mirror Server Architecture — DesarrolloPersonal.uno

## Overview

The platform runs on two identical server environments (mirrors) to enable safe development, testing, and controlled deploys to production.

| Environment | Server     | IP           | Directory                  | Port | URL                              |
|-------------|------------|--------------|----------------------------|------|----------------------------------|
| DEV         | srv126943  | 62.72.3.226  | /var/www/desarrollopersonal | 3001 | https://dev.desarrollopersonal.uno |
| PROD        | srv1313442 | (private)    | /var/www/desarrollopersonal | 3000 | https://desarrollopersonal.uno   |

Both servers run Ubuntu 24, PM2, and Nginx.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Next.js 15 (App Router)                 |
| Runtime     | Node.js via pnpm                        |
| Database    | PostgreSQL (Prisma ORM)                 |
| Auth        | NextAuth.js                             |
| Process mgr | PM2 (`ecosystem.config.js`)             |
| Web server  | Nginx (reverse proxy)                   |
| AI          | Groq API (Llama 3.3 70B)               |
| Payments    | Wompi (Colombia)                        |
| Email       | Resend                                  |
| Frontend    | React 19, Tailwind CSS, Lucide Icons    |

---

## SSH Access

```bash
# DEV
ssh juancho@62.72.3.226

# PROD
ssh juancho@<IP_PROD>
```

---

## Directory Structure (both servers)

```
/var/www/
├── desarrollopersonal/        # Active application
│   ├── .next/                 # Build output (not in Git)
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and integrations
│   ├── prisma/                # Schema and migrations
│   ├── public/                # Static assets
│   ├── scripts/               # Deploy and seed scripts
│   ├── nginx/                 # Nginx config templates
│   ├── docs/                  # This documentation
│   ├── .env                   # Environment vars (NOT in Git)
│   ├── ecosystem.config.js    # PM2 configuration
│   ├── package.json
│   └── next.config.js
└── /var/backups/desarrollopersonal/  # Automated backups
```

---

## Environment Variables

Each server has its own `.env` file (never committed to Git). Copy `.env.example` as a reference:

```bash
cp .env.example .env
nano .env   # Fill in actual values
```

Key differences between DEV and PROD `.env`:

| Variable         | DEV                              | PROD                             |
|------------------|----------------------------------|----------------------------------|
| `DATABASE_URL`   | `...desarrollopersonal_dev`      | `...desarrollopersonal_prod`     |
| `NEXTAUTH_URL`   | `https://dev.desarrollopersonal.uno` | `https://desarrollopersonal.uno` |
| `NEXTAUTH_SECRET`| (unique dev secret)              | (unique prod secret)             |
| `WOMPI_*`        | `pub_test_` / `prv_test_` keys   | `pub_prod_` / `prv_prod_` keys   |
| `PORT`           | 3001                             | 3000                             |

---

## PM2 Process Management

The `ecosystem.config.js` defines both `desarrollopersonal-dev` and `desarrollopersonal-prod` apps. Each server starts only its own app.

### Common Commands

```bash
# List running processes
pm2 list

# View real-time logs
pm2 logs desarrollopersonal-dev
pm2 logs desarrollopersonal-prod

# Restart
pm2 restart desarrollopersonal-dev

# Interactive monitoring dashboard
pm2 monit

# Persist config across reboots
pm2 save
pm2 startup   # Follow the printed instruction
```

---

## Nginx

Config templates are in `nginx/`. Deploy them on each server:

```bash
# DEV server
sudo cp nginx/desarrollopersonal-dev.conf /etc/nginx/sites-available/desarrollopersonal-dev
sudo ln -s /etc/nginx/sites-available/desarrollopersonal-dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d dev.desarrollopersonal.uno

# PROD server
sudo cp nginx/desarrollopersonal-prod.conf /etc/nginx/sites-available/desarrollopersonal-prod
sudo ln -s /etc/nginx/sites-available/desarrollopersonal-prod /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d desarrollopersonal.uno -d www.desarrollopersonal.uno
```

---

## Deploy Workflow

### DEV (develop and test here first)

```bash
# Connect to DEV
ssh juancho@62.72.3.226
cd /var/www/desarrollopersonal

# Create a feature branch
git checkout -b feature/my-feature

# Develop...

# Rebuild and test
rm -rf .next && pnpm build && pm2 restart desarrollopersonal-dev

# Open https://dev.desarrollopersonal.uno in browser
```

### Deploy to DEV (automated)

```bash
bash scripts/deploy-dev.sh [branch-name]
# Default branch: main
```

### Commit and Push

```bash
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Then open a PR and merge to main
```

### Deploy to PROD

```bash
# Always run backup first
bash scripts/backup.sh

# Then deploy (will confirm before proceeding)
bash scripts/deploy-prod.sh
```

---

## Database Management

Each server has an independent PostgreSQL instance.

```bash
# Run a new migration on DEV only
npx prisma migrate dev --name migration_name

# Apply existing migrations on PROD (no new migration created)
npx prisma migrate deploy

# Open Prisma Studio (with SSH tunnel for remote access)
# Local terminal:
ssh -L 5555:localhost:5555 juancho@62.72.3.226
# Then on the server:
npx prisma studio --port 5555
# Open http://localhost:5555 in browser
```

> Never sync data automatically from PROD to DEV. Export specific tables only when needed.

---

## Backup and Rollback

### Manual Backup

```bash
bash scripts/backup.sh
# Saves code (.tar.gz) and DB (.sql.gz) to /var/backups/desarrollopersonal/
# Backups older than 7 days are removed automatically
```

### Rollback

```bash
# List available backups
ls /var/backups/desarrollopersonal/

# Roll back to a specific date
bash scripts/rollback.sh 20260222-143000
```

---

## Troubleshooting

### Build very slow or stuck

```bash
# Check server load
top -bn1 | head -5

# Kill stuck build processes
sudo pkill -f "next build"

# Clean and rebuild
rm -rf .next node_modules/.cache
pnpm build
```

### "Cannot find module" errors

```bash
rm -rf node_modules && pnpm install
npx prisma generate
```

### Port already in use

```bash
sudo lsof -i :3001   # or :3000 for PROD
sudo kill -9 <PID>
```

### PM2 won't start

```bash
pm2 delete all
pm2 start ecosystem.config.js
```

### Stale code after build

```bash
rm -rf .next node_modules/.cache
pnpm build
pm2 restart <app-name>
```

---

## Golden Rules

1. **Never develop directly on PROD.** Always work on DEV, test thoroughly, then deploy.
2. **Always back up before deploying to PROD.**
3. **Database migrations**: run `migrate dev` on DEV, `migrate deploy` on PROD.
4. **Environment files**: DEV and PROD must have different `NEXTAUTH_SECRET`, `DATABASE_URL`, and `NEXTAUTH_URL`.
5. **Ask before**: touching PROD directly, running DB migrations, changing server config, or deleting data.
