# Production Deployment Guide

This guide walks you through deploying Sanandem to production using the recommended architecture (Vercel + Supabase).

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (https://vercel.com)
- [ ] Supabase account (https://supabase.com)
- [ ] Custom domain (optional but recommended)
- [ ] Node.js 20+ installed locally

## Architecture Overview

```
Users → Vercel Edge → [Sanandem App] → Supabase PostgreSQL
                   → [Sanadmin App] → 
```

## Step 1: Database Setup (30 minutes)

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `sanandem-production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Pro ($25/month recommended)
4. Wait for project to provision (~2 minutes)

### 1.2 Get Connection Strings

1. In your Supabase project, go to Settings → Database
2. Copy these connection strings:
   - **Direct connection**: For migrations and admin tasks
   - **Connection pooling** (Transaction mode): For the application

Example:
```
# Direct (for migrations)
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Pooler (for app)
postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres
```

### 1.3 Set Up Database Schema

On your local machine:

```bash
# Set environment variable
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run setup script
./scripts/setup-database.sh

# Or manually:
psql $DATABASE_URL -f database-setup.sql
```

### 1.4 Create Admin User

```bash
# Generate password hash
node scripts/generate-password-hash.js

# Edit create-admin.sql with your hash
# Then run:
psql $DATABASE_URL -f create-admin.sql
```

### 1.5 Verify Database Setup

```bash
# Check tables were created
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"

# Check admin user exists
psql $DATABASE_URL -c "SELECT username, role FROM \"user\";"
```

## Step 2: Environment Secrets (10 minutes)

### 2.1 Generate Secrets

```bash
node scripts/generate-secrets.js
```

This will output something like:
```
IP_SALT="a1b2c3d4..."
SESSION_SECRET="e5f6g7h8..."
API_KEY="i9j0k1l2..."
```

**IMPORTANT**: Save these values securely. You'll need them for both deployments.

### 2.2 Prepare Environment Variables

Create two sets of environment variables (we'll add them to Vercel next):

**For Sanandem (Public App):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres"
IP_SALT="[your-generated-salt]"
NODE_ENV="production"
```

**For Sanadmin (Admin App):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres"
IP_SALT="[same-as-above]"
SESSION_SECRET="[your-generated-secret]"
NODE_ENV="production"
```

## Step 3: Deploy Sanandem (Public App) (20 minutes)

### 3.1 Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `Sanandem` repository
4. Vercel will detect it's a monorepo - we'll configure each app separately

### 3.2 Configure Sanandem Build

1. **Framework Preset**: SvelteKit
2. **Root Directory**: `sanandem`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.svelte-kit` (auto-detected)
5. **Install Command**: `npm install`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| DATABASE_URL | `postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres` | Production |
| IP_SALT | `[your-salt]` | Production |
| NODE_ENV | `production` | Production |

### 3.4 Deploy

1. Click "Deploy"
2. Wait ~2-5 minutes for build
3. Test the deployment URL (e.g., `sanandem.vercel.app`)

### 3.5 Verify Deployment

Test these URLs:
- `https://[your-url].vercel.app/` - Homepage loads
- `https://[your-url].vercel.app/report` - Form accessible
- `https://[your-url].vercel.app/dashboard` - Dashboard shows data
- `https://[your-url].vercel.app/api/reports` - API returns JSON

## Step 4: Deploy Sanadmin (Admin App) (20 minutes)

### 4.1 Create New Vercel Project

1. Go to https://vercel.com/new
2. Import the same repository again
3. This time configure for sanadmin

### 4.2 Configure Sanadmin Build

1. **Framework Preset**: SvelteKit
2. **Root Directory**: `sanadmin`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.svelte-kit` (auto-detected)
5. **Install Command**: `npm install`

### 4.3 Add Environment Variables

| Name | Value | Environment |
|------|-------|-------------|
| DATABASE_URL | `[same-as-sanandem]` | Production |
| IP_SALT | `[same-as-sanandem]` | Production |
| SESSION_SECRET | `[your-session-secret]` | Production |
| NODE_ENV | `production` | Production |

### 4.4 Deploy

1. Click "Deploy"
2. Wait ~2-5 minutes for build
3. Test the deployment URL

### 4.5 Verify Admin Access

1. Go to `https://[sanadmin-url].vercel.app/`
2. You should see admin dashboard
3. Test login with the admin credentials you created

## Step 5: Custom Domains (Optional, 15 minutes)

### 5.1 Add Domain to Sanandem

1. In Vercel, go to Sanandem project → Settings → Domains
2. Add domain: `sanandem.com` (or your domain)
3. Follow Vercel's instructions to configure DNS
4. Wait for SSL certificate (automatic, ~5 minutes)

### 5.2 Add Domain to Sanadmin

1. Go to Sanadmin project → Settings → Domains
2. Add domain: `admin.sanandem.com` (or your subdomain)
3. Configure DNS
4. Wait for SSL

## Step 6: Monitoring & Security (20 minutes)

### 6.1 Set Up Error Tracking (Optional but Recommended)

**Option A: Sentry** (Recommended, has free tier)

1. Sign up at https://sentry.io
2. Create new project (SvelteKit)
3. Get DSN
4. Add to Vercel environment variables:
   ```
   SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"
   ```

**Option B: LogRocket** (Session replay)

1. Sign up at https://logrocket.com
2. Get app ID
3. Add to environment variables

### 6.2 Set Up Uptime Monitoring

**Recommended: UptimeRobot** (Free tier available)

1. Sign up at https://uptimerobot.com
2. Add monitors for:
   - `https://sanandem.com/`
   - `https://admin.sanandem.com/`
   - `https://sanandem.com/api/reports`
3. Configure alerts (email, Slack, etc.)

### 6.3 Configure Vercel Protection (Pro plan)

1. Go to Project Settings → Security
2. Enable:
   - **Deployment Protection**: Require auth for previews
   - **DDoS Protection**: Automatic (always enabled)
   - **Rate Limiting**: Custom rules (if needed)

### 6.4 Database Monitoring

In Supabase:
1. Go to Project Settings → Database
2. Enable:
   - **Connection Pooling**: Already enabled
   - **Point-in-time Recovery**: Automatic backups
3. Set up alerts for:
   - Database size (>80% capacity)
   - Connection count (>80% of limit)

## Step 7: Post-Deployment Testing (15 minutes)

### 7.1 Functional Testing

Test all critical paths:

**Sanandem (Public):**
- [ ] Homepage loads and displays correctly
- [ ] Submit a test report via `/report`
- [ ] View report in `/dashboard`
- [ ] Test data export (`/api/export?format=json`)
- [ ] Check all visualizations render

**Sanadmin (Admin):**
- [ ] Login with admin credentials
- [ ] View all reports in dashboard
- [ ] Test report filtering
- [ ] Check audit log (if implemented)

### 7.2 Performance Testing

Check Vercel Analytics:
1. Go to Project → Analytics
2. Verify:
   - Response times <500ms
   - No errors in logs
   - Reasonable bandwidth usage

### 7.3 Security Checklist

- [ ] HTTPS enforced (automatic with Vercel)
- [ ] No secrets in client-side code
- [ ] Database credentials not exposed
- [ ] Admin panel not publicly discoverable
- [ ] Rate limiting in place (implement if not done)
- [ ] CORS configured correctly

## Step 8: Ongoing Maintenance

### Daily/Weekly Tasks

1. **Monitor uptime**: Check UptimeRobot dashboard
2. **Review errors**: Check Sentry/error logs
3. **Database health**: Check Supabase metrics
4. **Cost monitoring**: Review Vercel/Supabase usage

### Monthly Tasks

1. **Database maintenance**: Run `database-maintenance.sql`
2. **Review analytics**: Check traffic patterns
3. **Update dependencies**: Security patches
4. **Backup verification**: Test restore procedure

### Quarterly Tasks

1. **Security audit**: Review access logs
2. **Performance optimization**: Analyze slow queries
3. **Cost optimization**: Review and optimize usage
4. **Rotate secrets**: Change IP_SALT, SESSION_SECRET

## Troubleshooting

### Build Fails on Vercel

**Symptom**: Build error during deployment

**Solutions**:
1. Check build logs in Vercel
2. Verify `package.json` scripts
3. Test build locally: `npm run build`
4. Check Node version compatibility

### Database Connection Errors

**Symptom**: "Cannot connect to database"

**Solutions**:
1. Verify DATABASE_URL is correct (use pooler URL)
2. Check Supabase project status
3. Verify IP whitelist (if configured)
4. Test connection locally:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```

### Admin Login Not Working

**Symptom**: Login fails with correct credentials

**Solutions**:
1. Verify admin user exists in database
2. Check password hash is correct
3. Verify SESSION_SECRET is set
4. Check browser console for errors

### API Returns 500 Errors

**Symptom**: `/api/reports` returns server error

**Solutions**:
1. Check Vercel function logs
2. Verify database connection
3. Check query syntax in code
4. Review error tracking (Sentry)

## Cost Monitoring

### Expected Monthly Costs

**Minimum (Production Ready):**
- Vercel Pro (2 projects): $40/month
- Supabase Pro: $25/month
- **Total**: ~$65/month

**Scaling Costs:**
- At 100k requests/month: ~$65-85/month
- At 1M requests/month: ~$100-200/month
- At 10M requests/month: ~$300-500/month

### How to Optimize Costs

1. **Enable caching**: Cache API responses
2. **Optimize images**: Use Vercel Image Optimization
3. **Database indexes**: Ensure queries are optimized
4. **Connection pooling**: Already enabled with Supabase pooler

## Support Resources

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **SvelteKit Discord**: https://svelte.dev/chat
- **Project Issues**: https://github.com/[your-repo]/issues

## Rollback Procedure

If something goes wrong:

1. **Revert to previous deployment**:
   - Go to Vercel → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Database rollback**:
   - Supabase maintains automatic backups
   - Go to Database → Backups
   - Restore to previous point-in-time

3. **Emergency contact**:
   - Have support contacts ready
   - Document incident in audit log

## Success Criteria

Your deployment is successful when:

- [x] Both apps accessible via HTTPS
- [x] Database queries working
- [x] Admin authentication functional
- [x] Monitoring/alerting configured
- [x] Backups running automatically
- [x] No errors in logs
- [x] Response times <500ms
- [x] Cost tracking in place

## Next Steps

After successful deployment:

1. **Set up CI/CD**: Automatic deployments on git push
2. **Implement rate limiting**: Protect API endpoints
3. **Add analytics**: Track usage patterns
4. **Document runbook**: Operations guide
5. **Train team**: Admin dashboard usage

---

**Congratulations! Your Sanandem platform is now live in production! 🎉**
