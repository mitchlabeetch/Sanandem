# Sanandem Quick Reference Guide

Quick access to common tasks and commands for Sanandem development and deployment.

## 📚 Documentation Index

- **[README.md](README.md)** - Project overview and getting started
- **[technew.md](technew.md)** - Complete deployment framework analysis (1,800+ lines)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step production deployment guide
- **[CI-CD.md](CI-CD.md)** - CI/CD pipeline recommendations
- **[SETUP.md](SETUP.md)** - Local development setup
- **[scripts/README.md](scripts/README.md)** - Helper scripts documentation

## 🚀 Quick Start

### First Time Setup (Local Development)

```bash
# 1. Clone and install
git clone https://github.com/mitchlabeetch/Sanandem.git
cd Sanandem

# 2. Generate secrets
node scripts/generate-secrets.js

# 3. Set up environment files
cp sanandem/.env.example sanandem/.env
cp sanadmin/.env.example sanadmin/.env
# Edit .env files with generated secrets

# 4. Set up database
export DATABASE_URL="postgresql://user:pass@localhost:5432/sanandem"
./scripts/setup-database.sh

# 5. Install and start
cd sanandem && npm install && npm run dev  # Port 5173
cd sanadmin && npm install && npm run dev  # Port 5174
```

## 🔧 Common Commands

### Development

```bash
# Start development servers
cd sanandem && npm run dev      # http://localhost:5173
cd sanadmin && npm run dev      # http://localhost:5174

# Run tests
npm run test:unit              # Unit tests
npm run test:e2e               # End-to-end tests
npm test                       # All tests

# Code quality
npm run lint                   # Check code style
npm run format                 # Format code
npm run check                  # Type checking
```

### Database

```bash
# Setup database
./scripts/setup-database.sh

# Push schema changes
npm run db:push

# Generate migrations
npm run db:generate

# Open database studio
npm run db:studio

# Maintenance
psql $DATABASE_URL -f database-maintenance.sql
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Security Tasks

### Generate Secrets

```bash
# All secrets at once
node scripts/generate-secrets.js

# Just password hash
node scripts/generate-password-hash.js
```

### Create Admin User

```bash
# 1. Generate hash
node scripts/generate-password-hash.js "YourPassword123"

# 2. Edit create-admin.sql with hash

# 3. Run script
psql $DATABASE_URL -f create-admin.sql
```

## 📊 Database Quick Reference

### Connection Strings

```bash
# Local
DATABASE_URL="postgresql://user:pass@localhost:5432/sanandem"

# Supabase (Direct - for migrations)
DATABASE_URL="postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres"

# Supabase (Pooler - for app)
DATABASE_URL="postgresql://postgres:[PASS]@[REF].pooler.supabase.com:6543/postgres"
```

### Useful Queries

```sql
-- Check table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(table_name::regclass)) as size
FROM information_schema.tables
WHERE table_schema = 'public';

-- Count records
SELECT 'medication_reports' as table, COUNT(*) FROM medication_reports
UNION ALL
SELECT 'user', COUNT(*) FROM "user";

-- Recent reports
SELECT * FROM recent_reports LIMIT 10;

-- Statistics overview
SELECT * FROM report_statistics;

-- Clean up expired data
SELECT clean_expired_sessions();
SELECT clean_expired_cache();
```

## 🚀 Deployment Quick Reference

### Production Deployment (Vercel + Supabase)

```bash
# 1. Create Supabase project
# Visit https://supabase.com → New Project

# 2. Setup database
export DATABASE_URL="[supabase-connection-string]"
./scripts/setup-database.sh

# 3. Deploy to Vercel
# Visit https://vercel.com → Import Git Repository
# Configure both sanandem and sanadmin projects

# 4. Add environment variables in Vercel
# See DEPLOYMENT.md for complete list
```

### Environment Variables Checklist

**Both Apps:**
- `DATABASE_URL` ✅
- `IP_SALT` ✅
- `NODE_ENV` ✅

**Sanadmin Only:**
- `SESSION_SECRET` ✅

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# E2E tests (requires app running)
npm run test:e2e

# Watch mode
npm run test:unit -- --watch

# Coverage
npm run test:unit -- --coverage
```

## 📦 Package Management

```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check if PostgreSQL is running
pg_isready

# Reset database
dropdb sanandem
createdb sanandem
./scripts/setup-database.sh
```

### Port Already in Use

```bash
# Find process on port 5173
lsof -ti:5173

# Kill process
kill -9 $(lsof -ti:5173)

# Or change port in .env
PORT=5175
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear SvelteKit cache
rm -rf .svelte-kit
npm run build
```

### Type Errors

```bash
# Run type checking
npm run check

# Generate types
npm run prepare
```

## 📊 Monitoring

### Production Health Checks

```bash
# Check API
curl https://sanandem.com/api/reports

# Check database connection (requires admin access)
psql $DATABASE_URL -c "SELECT 1;"

# Check disk space (server)
df -h

# Check database size
psql $DATABASE_URL -c "SELECT pg_database_size('postgres');"
```

### Logs

```bash
# Vercel logs (CLI)
vercel logs [deployment-url]

# Database logs (Supabase)
# View in Supabase Dashboard → Logs

# Local logs
# Check terminal output
```

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create PR on GitHub

# After merge, update local
git checkout main
git pull origin main
```

## 📝 Common Tasks

### Add New Environment Variable

1. Add to `.env.example` files
2. Add to `DEPLOYMENT.md` documentation
3. Update Vercel environment variables
4. Redeploy applications

### Update Database Schema

```bash
# 1. Edit src/lib/server/db/schema.ts
# 2. Push changes
npm run db:push
# 3. Verify in Drizzle Studio
npm run db:studio
```

### Create Database Backup

```bash
# Local backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compress
gzip backup-$(date +%Y%m%d).sql

# Supabase backups are automatic (Pro plan)
```

### Restore Database Backup

```bash
# From SQL file
psql $DATABASE_URL < backup-20241226.sql

# From compressed file
gunzip -c backup-20241226.sql.gz | psql $DATABASE_URL
```

## 🆘 Emergency Procedures

### Rollback Deployment

**Vercel:**
1. Go to Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Database:**
1. Go to Supabase → Database → Backups
2. Select restore point
3. Restore database

### Take Site Down (Emergency)

**Vercel:**
```bash
# Pause production deployment (requires Vercel CLI)
vercel deploy --pause
```

**Alternative:**
- Add maintenance page to `static` folder
- Create maintenance mode flag in database

## 📞 Support

- **Issues**: https://github.com/mitchlabeetch/Sanandem/issues
- **Discussions**: https://github.com/mitchlabeetch/Sanandem/discussions
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support

## 📖 Learning Resources

- **SvelteKit**: https://kit.svelte.dev/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs

---

**Last Updated**: December 26, 2024

For detailed information, see the full documentation files listed at the top of this guide.
