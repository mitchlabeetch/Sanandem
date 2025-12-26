# Sanandem Deployment Framework & Infrastructure Audit

**Document Version**: 1.0  
**Last Updated**: December 26, 2024  
**Purpose**: Comprehensive audit of deployment options, infrastructure requirements, and implementation roadmap for Sanandem platform

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Architecture Analysis](#application-architecture-analysis)
3. [Frontend Hosting Solutions](#frontend-hosting-solutions)
4. [Backend Hosting Solutions](#backend-hosting-solutions)
5. [Database Solutions](#database-solutions)
6. [Recommended Architecture](#recommended-architecture)
7. [SQL Database Setup](#sql-database-setup)
8. [Environment Variables & Secret Keys](#environment-variables--secret-keys)
9. [Frontend-Backend Integration](#frontend-backend-integration)
10. [Cost Analysis](#cost-analysis)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### Current State
- **Frontend**: SvelteKit 2.x with Svelte 5
- **Backend**: SvelteKit server endpoints (API routes)
- **Database**: PostgreSQL via Drizzle ORM
- **Two Applications**:
  - `sanandem`: Public-facing web application for data submission and visualization
  - `sanadmin`: Admin dashboard for data management and moderation

### Recommended Solution
**Optimal Stack for Production:**
- **Frontend & Backend**: Vercel (both apps) - $20/month per app after free tier
- **Database**: Supabase Pro - $25/month
- **CDN/Assets**: Cloudflare (Free tier)
- **Estimated Monthly Cost**: ~$65-85/month for production-ready deployment

**Alternative Budget Stack:**
- **Full Stack**: Railway - $5-20/month
- **Total Estimated Cost**: $5-20/month (hobby tier)

---

## Application Architecture Analysis

### Sanandem (Public Application)

#### Core Functions
1. **Data Submission** (`/report` route)
   - Anonymous medication report submission
   - Form validation and processing
   - IP address hashing for abuse prevention

2. **Data Visualization** (`/dashboard`, `/visualizations` routes)
   - Interactive charts using ECharts and D3.js
   - Real-time statistics and aggregations
   - Network graphs for medication-side effect relationships

3. **Data Export** (`/api/export` endpoint)
   - CSV and JSON export functionality
   - Anonymized data export for researchers
   - Rate limiting required for production

4. **Public Research Portal** (`/research`, `/about` routes)
   - Educational content
   - Literature references
   - Static content pages

#### Key Dependencies
```json
{
  "runtime": [
    "@sveltejs/kit": "^2.49.0",
    "svelte": "^5.45.2",
    "drizzle-orm": "^0.44.7",
    "postgres": "^3.4.7",
    "@node-rs/argon2": "^2.0.2"
  ],
  "visualization": [
    "d3": "^7.9.0",
    "echarts": "^5.6.0",
    "layerchart": "^1.0.12"
  ],
  "styling": [
    "tailwindcss": "^4.1.18"
  ]
}
```

#### Server Endpoints
- `GET /api/reports` - Fetch medication reports with filters
- `GET /api/export` - Export data (CSV/JSON)
- `POST /report` - Submit new medication report
- All visualization pages load data server-side

### Sanadmin (Admin Application)

#### Core Functions
1. **Admin Dashboard** (`/dashboard` route)
   - Report moderation and verification
   - Data management interface
   - Statistics overview

2. **User Management** (planned)
   - Admin user authentication
   - Role-based access control (RBAC)
   - Session management using Oslo.js

3. **Audit Logging**
   - Track admin actions
   - Compliance and security monitoring

#### Key Dependencies
```json
{
  "runtime": [
    "@sveltejs/kit": "^2.49.0",
    "svelte": "^5.45.2",
    "drizzle-orm": "^0.44.7",
    "flowbite-svelte": "^1.28.3",
    "flowbite-svelte-admin-dashboard": "^2.1.1"
  ],
  "ui": [
    "flowbite-svelte": "^1.28.3",
    "dayjs": "^1.11.19"
  ]
}
```

#### Server Endpoints
- `GET /api/reports` - Admin view of all reports
- `POST /api/reports/:id/verify` - Verify reports (to implement)
- `DELETE /api/reports/:id` - Delete reports (to implement)
- Authentication endpoints (to implement)

### Database Schema

#### Tables
1. **medication_reports** - Primary data table
   - Stores anonymous medication reports
   - Fields: medication info, side effects, demographics, timestamps

2. **user** - Admin users
   - Authentication data
   - Role management

3. **session** - Session management
   - Admin login sessions
   - Expiry tracking

4. **audit_log** - Compliance tracking
   - Admin actions
   - Security monitoring

5. **statistics_cache** - Performance optimization
   - Cached aggregations
   - TTL-based invalidation

---

## Frontend Hosting Solutions

### 1. Vercel (RECOMMENDED)

**URL**: https://vercel.com/  
**Best For**: SvelteKit applications, serverless functions

#### Pros
- ✅ **Native SvelteKit support** - Built by the creators of Next.js, excellent with modern frameworks
- ✅ **Zero configuration deployment** - Connect GitHub and deploy automatically
- ✅ **Edge network** - Global CDN with 70+ edge locations
- ✅ **Automatic HTTPS** - SSL certificates included
- ✅ **Preview deployments** - Every git push gets a unique URL
- ✅ **Environment variables** - Easy management per environment
- ✅ **Analytics built-in** - Web vitals and performance monitoring
- ✅ **99.99% uptime SLA** (Pro plan)
- ✅ **Excellent DX** - Best developer experience

#### Cons
- ❌ **Serverless limitations** - 10s execution time (Hobby), 60s (Pro)
- ❌ **Cold starts** - Occasional latency on first request
- ❌ **Pricing can scale** - Gets expensive with high traffic
- ❌ **Vendor lock-in** - Difficult to migrate away

#### Pricing (2024)
- **Hobby**: $0/month
  - 100 GB bandwidth
  - Serverless function execution: 100 GB-hours
  - 6,000 build minutes
  - Good for development/testing
  
- **Pro**: $20/month per member
  - 1 TB bandwidth
  - Serverless function execution: 1000 GB-hours
  - 24,000 build minutes
  - Password protection
  - **Recommended for production**

- **Enterprise**: Custom pricing (starts ~$500/month)
  - Dedicated support
  - Advanced security
  - SLA guarantees

#### Benchmarks
- **Cold start**: 50-200ms
- **Warm response**: 10-50ms
- **Build time**: 2-5 minutes for SvelteKit apps
- **Global latency**: <100ms from edge locations

#### Setup Requirements
1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.svelte-kit` (auto-detected)
   - Install Command: `npm install`
3. Set environment variables
4. Deploy

---

### 2. Netlify

**URL**: https://www.netlify.com/  
**Best For**: Static sites, JAMstack applications

#### Pros
- ✅ **Generous free tier** - 100 GB bandwidth/month
- ✅ **Great for static sites** - Excellent CDN
- ✅ **Form handling** - Built-in form processing
- ✅ **Split testing** - A/B testing built-in
- ✅ **Deploy previews** - Branch previews
- ✅ **Edge functions** - Deno-powered edge compute

#### Cons
- ❌ **Less optimized for SvelteKit** - Better for static exports
- ❌ **Function limitations** - 10s timeout on free tier
- ❌ **Build minutes limited** - 300 minutes/month (free)
- ❌ **Less performance** vs Vercel for SSR

#### Pricing (2024)
- **Free**: $0/month
  - 100 GB bandwidth
  - 300 build minutes
  - 125k serverless requests
  
- **Pro**: $19/month per member
  - 400 GB bandwidth
  - 25,000 serverless requests
  - Better for production

#### Benchmarks
- **Cold start**: 100-300ms
- **Build time**: 3-7 minutes
- **Good for**: Static sites, lower performance requirements

---

### 3. Cloudflare Pages

**URL**: https://pages.cloudflare.com/  
**Best For**: Static sites, edge-first applications

#### Pros
- ✅ **Unlimited bandwidth** - No bandwidth caps even on free tier
- ✅ **Global edge network** - Cloudflare's massive CDN
- ✅ **Free tier is generous** - 500 builds/month
- ✅ **Fast edge performance** - Workers integration
- ✅ **R2 storage option** - Object storage available

#### Cons
- ❌ **Limited SSR support** - Better for static or edge-rendered
- ❌ **Learning curve** - Workers API different from traditional
- ❌ **Function size limits** - 1 MB script size
- ❌ **Platform immaturity** - Newer platform, fewer integrations

#### Pricing (2024)
- **Free**: $0/month
  - Unlimited bandwidth
  - 500 builds/month
  - 100,000 requests/day
  
- **Pro**: $20/month
  - Unlimited builds
  - Advanced features

#### Benchmarks
- **Edge latency**: <50ms globally
- **Good for**: High-traffic static sites

---

### 4. Railway (Full Stack)

**URL**: https://railway.app/  
**Best For**: Full-stack applications, databases included

#### Pros
- ✅ **All-in-one platform** - Frontend, backend, database together
- ✅ **Simple pricing** - Usage-based, pay for what you use
- ✅ **No cold starts** - Always-on containers
- ✅ **Easy database setup** - PostgreSQL in one click
- ✅ **Developer friendly** - Great DX

#### Cons
- ❌ **More expensive at scale** - Usage-based can add up
- ❌ **Less edge presence** - Not a global CDN
- ❌ **Resource limits** - $5 plan has constraints

#### Pricing (2024)
- **Trial**: $5 credit
- **Developer**: $5/month minimum
  - Usage-based billing
  - $0.000463/GB-hour (memory)
  - $0.000231/vCPU-hour
  
- **Team**: $20/month per seat + usage

#### Benchmarks
- **Response time**: 50-150ms (single region)
- **Zero cold starts**
- **Good for**: Moderate traffic apps

---

## Backend Hosting Solutions

### 1. Vercel (RECOMMENDED)

**Verdict**: Since SvelteKit combines frontend and backend, Vercel can host both in one deployment.

#### API Routes as Serverless Functions
- Each API endpoint becomes a serverless function
- Automatic scaling
- Pay per execution

**Best practices for Vercel backend:**
- Keep functions under 50 MB
- Optimize for fast execution (<10s)
- Use edge functions where possible
- Cache aggressively

---

### 2. Railway

**URL**: https://railway.app/

#### Pros
- ✅ **Long-running processes** - Not limited to serverless constraints
- ✅ **WebSocket support** - Real-time features
- ✅ **Container-based** - More flexibility
- ✅ **Database included** - PostgreSQL provisioning

#### Cons
- ❌ **Single region** - Must choose primary region
- ❌ **No global edge** - Higher latency for distant users

**Use case**: If you need long-running processes, background jobs, or WebSockets.

---

### 3. Render

**URL**: https://render.com/  
**Best For**: Docker-based deployments, managed services

#### Pros
- ✅ **Free tier available** - Good for testing
- ✅ **Auto-scaling** - Scales with traffic
- ✅ **Managed PostgreSQL** - Database hosting
- ✅ **Zero DevOps** - Easy setup

#### Cons
- ❌ **Cold starts on free tier** - App spins down after inactivity
- ❌ **Limited regions** - Not as globally distributed
- ❌ **Slower cold start** - Can take 30s+ to wake up

#### Pricing (2024)
- **Free**: $0/month
  - Apps spin down after 15 min inactivity
  - Good for development
  
- **Starter**: $7/month per service
  - Always-on
  - Reasonable for production
  
- **Pro**: $25/month
  - Better resources

---

### 4. Fly.io

**URL**: https://fly.io/  
**Best For**: Global edge deployment, containerized apps

#### Pros
- ✅ **Multi-region deployment** - Deploy close to users globally
- ✅ **Container-based** - Full flexibility
- ✅ **Good free tier** - 3 VMs free
- ✅ **Fast scaling** - Automatic

#### Cons
- ❌ **More complex** - Requires Docker knowledge
- ❌ **Database separate** - Need to manage separately
- ❌ **Configuration overhead** - More setup required

#### Pricing (2024)
- **Free**: Up to $5/month usage included
- **Pay as you go**: ~$2-5/month for small apps

---

## Database Solutions

### 1. Supabase (RECOMMENDED)

**URL**: https://supabase.com/  
**Best For**: PostgreSQL with built-in features, API generation

#### Pros
- ✅ **Managed PostgreSQL** - Fully managed, automatic backups
- ✅ **Built-in features** - Auth, Storage, Realtime subscriptions
- ✅ **Auto-generated API** - REST and GraphQL APIs included
- ✅ **Dashboard included** - Great UI for data management
- ✅ **Excellent free tier** - 500 MB database, unlimited API requests
- ✅ **Connection pooling** - PgBouncer included
- ✅ **Global CDN** - Fast edge functions
- ✅ **Daily backups** - Point-in-time recovery (Pro)

#### Cons
- ❌ **Paused after 1 week inactivity** (free tier)
- ❌ **500 MB limit** on free tier
- ❌ **Extra features might not be needed** - If only using PostgreSQL

#### Pricing (2024)
- **Free**: $0/month
  - 500 MB database
  - Unlimited API requests
  - 50,000 monthly active users
  - 5 GB bandwidth
  - 1 GB file storage
  - Pauses after 1 week inactivity
  - **Good for development/testing**
  
- **Pro**: $25/month
  - 8 GB database
  - No pausing
  - Daily backups
  - 7-day log retention
  - 50 GB bandwidth
  - 100 GB file storage
  - **RECOMMENDED for production**
  
- **Team**: $599/month
  - 500 GB database
  - Priority support

#### Benchmarks
- **Query latency**: 10-50ms (same region)
- **Connection pool**: 15 connections (free), 200 (pro)
- **Uptime**: 99.9% (Pro)
- **Backup retention**: 7 days (Pro)

#### Setup for Sanandem
```bash
# 1. Create project at supabase.com
# 2. Get connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# 3. Run migrations
npm run db:push

# 4. Configure connection pooling
# Use pooler URL for serverless:
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres"
```

---

### 2. Neon

**URL**: https://neon.tech/  
**Best For**: Serverless PostgreSQL, auto-scaling

#### Pros
- ✅ **Serverless PostgreSQL** - Scales to zero
- ✅ **Branching** - Database branches like Git
- ✅ **Fast provisioning** - Instant database creation
- ✅ **Cost-effective** - Pay only for usage
- ✅ **Connection pooling** - Built-in
- ✅ **Generous free tier** - 512 MB storage

#### Cons
- ❌ **Limited extensions** - Not all PostgreSQL extensions supported
- ❌ **Newer platform** - Less mature than others
- ❌ **Cold start possible** - After inactivity

#### Pricing (2024)
- **Free**: $0/month
  - 512 MB storage
  - 1 project
  - Auto-suspend after inactivity
  
- **Pro**: $19/month
  - 20 GB storage included
  - Multiple projects
  - No auto-suspend
  
- **Scale**: $69/month
  - 50 GB storage included

#### Benchmarks
- **Cold start**: 500ms - 2s
- **Warm queries**: 10-30ms
- **Good for**: Development, variable workloads

---

### 3. Railway PostgreSQL

**URL**: https://railway.app/  
**Best For**: Integrated with Railway hosting

#### Pros
- ✅ **One-click setup** - If using Railway for hosting
- ✅ **Same platform** - Everything in one place
- ✅ **Simple billing** - Combined with app hosting
- ✅ **No connection pooling needed** - Direct connections work

#### Cons
- ❌ **More expensive** - Higher cost per GB
- ❌ **Single region** - No global replication
- ❌ **Limited features** - Basic PostgreSQL only

#### Pricing (2024)
- **Usage-based**:
  - ~$10-15/month for small database
  - Includes backups

---

### 4. AWS RDS

**URL**: https://aws.amazon.com/rds/  
**Best For**: Enterprise applications, maximum control

#### Pros
- ✅ **Enterprise-grade** - Maximum reliability
- ✅ **Full control** - All PostgreSQL features
- ✅ **Scalability** - Massive scale possible
- ✅ **Multi-region** - Global replication

#### Cons
- ❌ **Complex setup** - Requires AWS expertise
- ❌ **Expensive** - Higher costs
- ❌ **Overkill** - For small/medium apps

#### Pricing (2024)
- **db.t3.micro**: ~$15/month (minimum)
- **db.t3.small**: ~$30/month
- Plus storage costs

**Not recommended** unless enterprise requirements or existing AWS infrastructure.

---

## Recommended Architecture

### Production Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                      Users/Browsers                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Network (CDN)                   │
│  - SSL/TLS termination                                   │
│  - DDoS protection                                       │
│  - Static asset caching                                  │
└────────────┬────────────────────────────────────────────┘
             │
             ├──────────────────────┬─────────────────────┐
             ▼                      ▼                     ▼
   ┌─────────────────┐   ┌──────────────────┐  ┌─────────────────┐
   │   Sanandem      │   │    Sanadmin      │  │  Serverless     │
   │  (Public App)   │   │  (Admin App)     │  │   Functions     │
   │  Vercel Deploy  │   │  Vercel Deploy   │  │  (API Routes)   │
   └────────┬────────┘   └────────┬─────────┘  └────────┬────────┘
            │                     │                      │
            └─────────────────────┼──────────────────────┘
                                  ▼
                    ┌──────────────────────────┐
                    │   Supabase PostgreSQL    │
                    │  - Connection pooling     │
                    │  - Daily backups          │
                    │  - Point-in-time recovery │
                    └──────────────────────────┘
```

#### Why This Architecture?

1. **Performance**: Vercel's edge network provides <100ms response times globally
2. **Scalability**: Automatic scaling for both apps
3. **Reliability**: 99.99% uptime from both Vercel and Supabase
4. **Developer Experience**: Simple deployment, great debugging tools
5. **Cost-Effective**: ~$65-85/month for production-ready setup

#### Cost Breakdown
- Vercel Pro (2 apps): $40/month
- Supabase Pro: $25/month
- **Total**: ~$65/month

---

### Budget Architecture (Alternative)

```
┌─────────────────────────────────────────────────────────┐
│                      Users/Browsers                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                Railway Platform                          │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │
│  │  Sanandem    │ │  Sanadmin    │ │  PostgreSQL    │  │
│  │  Container   │ │  Container   │ │   Database     │  │
│  └──────────────┘ └──────────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Cost Breakdown
- Railway Developer: $5-20/month (usage-based)
- Everything included (hosting + database)
- **Total**: ~$5-20/month

#### Trade-offs
- ✅ Much cheaper
- ❌ Single region (higher latency for global users)
- ❌ Less scalable
- ❌ No global CDN

**Good for**: Side projects, MVP, limited budget

---

## SQL Database Setup

### Complete Database Initialization Script

```sql
-- ============================================
-- Sanandem Database Setup Script
-- PostgreSQL 14+
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- ADMIN USERS & AUTHENTICATION
-- ============================================

-- Admin user table
CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT PRIMARY KEY,
    "age" INTEGER,
    "username" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "last_login_at" TIMESTAMP,
    CONSTRAINT "user_role_check" CHECK ("role" IN ('admin', 'superadmin'))
);

CREATE INDEX IF NOT EXISTS "idx_user_username" ON "user"("username");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "user"("role");

-- Session management table
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_session_user_id" ON "session"("user_id");
CREATE INDEX IF NOT EXISTS "idx_session_expires_at" ON "session"("expires_at");

-- ============================================
-- MEDICATION REPORTS
-- ============================================

-- Main medication reports table
CREATE TABLE IF NOT EXISTS "medication_reports" (
    "id" SERIAL PRIMARY KEY,
    
    -- Medication information
    "medication_name" TEXT NOT NULL,
    "medication_dosage" TEXT,
    "medication_type" TEXT,
    
    -- Effects
    "side_effects" JSONB NOT NULL,
    "positive_effects" JSONB,
    
    -- Severity and impact
    "severity" INTEGER NOT NULL CHECK ("severity" >= 1 AND "severity" <= 10),
    "impact_on_daily_life" TEXT,
    "duration_of_effect" TEXT,
    
    -- Demographics (all optional for anonymity)
    "age" INTEGER CHECK ("age" >= 0 AND "age" <= 120),
    "age_group" TEXT,
    "gender" TEXT,
    "ethnicity" TEXT,
    "location" TEXT,
    
    -- Additional context
    "usage_duration" TEXT,
    "other_medications" JSONB,
    "medical_conditions" JSONB,
    
    -- Metadata
    "is_verified" BOOLEAN DEFAULT FALSE,
    "is_anonymized" BOOLEAN NOT NULL DEFAULT TRUE,
    "submission_source" TEXT DEFAULT 'web_form',
    "ip_hash" TEXT,
    
    -- Timestamps
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "verified_at" TIMESTAMP,
    
    -- Constraints
    CONSTRAINT "medication_reports_age_group_check" 
        CHECK ("age_group" IN ('0-17', '18-25', '26-35', '36-50', '51-65', '65+'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_medication_reports_medication_name" 
    ON "medication_reports"("medication_name");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_created_at" 
    ON "medication_reports"("created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_medication_reports_severity" 
    ON "medication_reports"("severity");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_gender" 
    ON "medication_reports"("gender");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_age_group" 
    ON "medication_reports"("age_group");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_is_verified" 
    ON "medication_reports"("is_verified");

-- GIN indexes for JSONB fields (faster searches)
CREATE INDEX IF NOT EXISTS "idx_medication_reports_side_effects" 
    ON "medication_reports" USING GIN("side_effects");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_positive_effects" 
    ON "medication_reports" USING GIN("positive_effects");

-- Text search index for medication names
CREATE INDEX IF NOT EXISTS "idx_medication_reports_medication_name_trgm" 
    ON "medication_reports" USING GIN("medication_name" gin_trgm_ops);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS "audit_log" (
    "id" SERIAL PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_audit_log_user_id" ON "audit_log"("user_id");
CREATE INDEX IF NOT EXISTS "idx_audit_log_created_at" ON "audit_log"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_audit_log_entity" ON "audit_log"("entity_type", "entity_id");

-- ============================================
-- STATISTICS CACHE
-- ============================================

CREATE TABLE IF NOT EXISTS "statistics_cache" (
    "id" SERIAL PRIMARY KEY,
    "cache_key" TEXT NOT NULL UNIQUE,
    "cache_data" JSONB NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_statistics_cache_key" ON "statistics_cache"("cache_key");
CREATE INDEX IF NOT EXISTS "idx_statistics_cache_expires_at" ON "statistics_cache"("expires_at");

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for medication_reports
DROP TRIGGER IF EXISTS update_medication_reports_updated_at ON "medication_reports";
CREATE TRIGGER update_medication_reports_updated_at
    BEFORE UPDATE ON "medication_reports"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired sessions (should be run periodically)
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM "session" WHERE "expires_at" < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM "statistics_cache" WHERE "expires_at" < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional - for development)
-- ============================================

-- Uncomment to insert sample data for testing

/*
INSERT INTO "medication_reports" (
    "medication_name",
    "medication_dosage",
    "side_effects",
    "positive_effects",
    "severity",
    "age",
    "age_group",
    "gender",
    "duration_of_effect",
    "submission_source"
) VALUES 
    (
        'Aspirin',
        '500mg',
        '["Headache", "Nausea"]'::jsonb,
        '["Pain relief"]'::jsonb,
        3,
        35,
        '26-35',
        'female',
        '2 hours',
        'web_form'
    ),
    (
        'Ibuprofen',
        '200mg',
        '["Stomach pain", "Dizziness"]'::jsonb,
        '["Reduced inflammation"]'::jsonb,
        5,
        42,
        '36-50',
        'male',
        '4 hours',
        'web_form'
    );
*/

-- ============================================
-- PERMISSIONS (Adjust based on your setup)
-- ============================================

-- Grant necessary permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- ============================================
-- MAINTENANCE
-- ============================================

-- Create a scheduled job to clean up expired sessions and cache
-- (This depends on your database hosting solution)
-- For Supabase, use pg_cron extension
-- For Railway/other, set up a cron job or scheduled task

/*
-- Example with pg_cron (if available):
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Clean expired sessions daily at 2 AM
SELECT cron.schedule('clean-sessions', '0 2 * * *', 'SELECT clean_expired_sessions();');

-- Clean expired cache hourly
SELECT cron.schedule('clean-cache', '0 * * * *', 'SELECT clean_expired_cache();');
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check table creation
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check row counts
SELECT 
    'user' as table_name, COUNT(*) as row_count FROM "user"
UNION ALL
SELECT 'session', COUNT(*) FROM "session"
UNION ALL
SELECT 'medication_reports', COUNT(*) FROM "medication_reports"
UNION ALL
SELECT 'audit_log', COUNT(*) FROM "audit_log"
UNION ALL
SELECT 'statistics_cache', COUNT(*) FROM "statistics_cache";
```

### Database Maintenance Scripts

#### 1. Cleanup Script (Run periodically)
```sql
-- Clean expired sessions
SELECT clean_expired_sessions();

-- Clean expired cache
SELECT clean_expired_cache();

-- Vacuum tables for performance
VACUUM ANALYZE "medication_reports";
VACUUM ANALYZE "session";
VACUUM ANALYZE "statistics_cache";
```

#### 2. Backup Script (Use with pg_dump)
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="sanandem_backup_$DATE.sql"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Upload to S3 or other storage (optional)
# aws s3 cp ${BACKUP_FILE}.gz s3://your-bucket/backups/

echo "Backup created: ${BACKUP_FILE}.gz"
```

---

## Environment Variables & Secret Keys

### Required Environment Variables

#### Sanandem (Public App)

```bash
# .env file for sanandem

# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
# Example Supabase:
# DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres"

# ============================================
# SECURITY
# ============================================
# Generate with: openssl rand -hex 32
IP_SALT="[64-character-hex-string]"

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV="production"
PORT=5173

# ============================================
# OPTIONAL: RATE LIMITING
# ============================================
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes

# ============================================
# OPTIONAL: MONITORING
# ============================================
# Sentry DSN for error tracking
SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"

# ============================================
# OPTIONAL: ANALYTICS
# ============================================
# Google Analytics or Plausible
ANALYTICS_ID="GA-XXXXXXXXX"
```

#### Sanadmin (Admin App)

```bash
# .env file for sanadmin

# ============================================
# DATABASE (Same as sanandem)
# ============================================
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"

# ============================================
# SECURITY
# ============================================
# Same salt as sanandem for IP hashing consistency
IP_SALT="[64-character-hex-string]"

# Session secret for admin authentication
# Generate with: openssl rand -hex 32
SESSION_SECRET="[64-character-hex-string]"

# ============================================
# AUTHENTICATION
# ============================================
# Session duration in seconds (default 7 days)
SESSION_DURATION=604800

# Admin user creation (for initial setup)
ADMIN_USERNAME="admin"
# Create password hash with: node -e "const argon2 = require('@node-rs/argon2'); argon2.hash('your-password').then(console.log)"
ADMIN_PASSWORD_HASH="[argon2-hash]"

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV="production"
PORT=5174

# ============================================
# OPTIONAL: CORS
# ============================================
# If sanadmin needs to make API calls to sanandem
CORS_ORIGIN="https://sanandem.com"

# ============================================
# OPTIONAL: MONITORING
# ============================================
SENTRY_DSN="https://[key]@[org].ingest.sentry.io/[project]"
```

### Secret Key Generation Guide

#### 1. Generate IP_SALT
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6...  (64 characters)
```

#### 2. Generate SESSION_SECRET
```bash
openssl rand -hex 32
# Output: f6e5d4c3b2a1...  (64 characters)
```

#### 3. Generate Admin Password Hash
```javascript
// generate-password.js
import argon2 from '@node-rs/argon2';

const password = 'YourSecurePassword123!';
const hash = await argon2.hash(password);
console.log('Password hash:', hash);
```

Run with:
```bash
node generate-password.js
```

#### 4. Create Initial Admin User
```sql
-- Run after database setup
INSERT INTO "user" (
    "id",
    "username",
    "password_hash",
    "role",
    "created_at"
) VALUES (
    'admin-' || gen_random_uuid()::text,
    'admin',
    '[YOUR_ARGON2_HASH]',
    'superadmin',
    NOW()
);
```

### Platform-Specific Configuration

#### Vercel Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all variables from above
3. Set scope (Production/Preview/Development)
4. Variables are encrypted at rest

#### Railway Environment Variables
1. Go to Service → Variables
2. Add variables (they're automatically available to all deployments)
3. Railway handles encryption

#### Supabase Connection Strings
```bash
# Direct connection (not recommended for serverless)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Connection pooler (recommended for serverless)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres"

# Session pooler (for transactions)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:5432/postgres"
```

---

## Frontend-Backend Integration

### API Architecture

#### Current Implementation

Both `sanandem` and `sanadmin` use SvelteKit's unified approach:
- Frontend and backend in same codebase
- API routes defined in `/src/routes/api/**` directories
- Server-side rendering (SSR) for pages
- Form actions for data submission

#### API Endpoints

##### Public API (Sanandem)

1. **GET /api/reports**
   - **Purpose**: Fetch medication reports with filters
   - **Parameters**: 
     - `limit`: Number of reports (default: 50)
     - `offset`: Pagination offset (default: 0)
     - `gender`: Filter by gender
     - `minSeverity`: Minimum severity level
     - `medicationName`: Filter by medication
   - **Response**: JSON with reports, statistics, and pagination info
   - **Authentication**: None (public)
   - **Rate Limiting**: Recommended (100 requests per 15 min)

2. **GET /api/export**
   - **Purpose**: Export anonymized data for research
   - **Parameters**:
     - `format`: csv or json
     - `limit`: Max 5000 records
     - `gender`, `minSeverity`, `medicationName`: Filters
   - **Response**: CSV or JSON file download
   - **Authentication**: None (public, but should be rate-limited)

3. **POST /report** (Form Action)
   - **Purpose**: Submit new medication report
   - **Method**: SvelteKit form action
   - **Fields**:
     - medicationName (required)
     - sideEffects (required, comma-separated)
     - severity (required, 1-10)
     - positiveEffects (optional)
     - age, gender, medicationDosage, etc. (optional)
   - **Response**: Success/error message
   - **IP Hashing**: Automatic for abuse prevention

##### Admin API (Sanadmin)

1. **GET /api/reports** (Admin version)
   - Same as public but includes admin-only fields
   - Shows IP hashes, verification status
   - Access control required (to be implemented)

2. **POST /api/reports/:id/verify** (To Implement)
   - Mark report as verified
   - Requires admin authentication

3. **DELETE /api/reports/:id** (To Implement)
   - Delete inappropriate reports
   - Requires admin authentication
   - Should log to audit_log

4. **POST /api/auth/login** (To Implement)
   - Admin login endpoint
   - Returns session token

5. **POST /api/auth/logout** (To Implement)
   - Admin logout
   - Invalidates session

### Frontend-Backend Communication Bridges

#### 1. Server-Side Data Loading

**Pattern**: SvelteKit's load functions
```typescript
// +page.server.ts
export async function load() {
    const reports = await getReports({ limit: 50 });
    const stats = await getReportStatistics();
    
    return {
        reports,
        stats
    };
}
```

**Benefits**:
- SEO-friendly (server-rendered)
- No loading states on initial load
- Data available immediately

#### 2. Form Actions

**Pattern**: Progressive enhancement
```typescript
// +page.server.ts
export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        // Process form
        return { success: true };
    }
};
```

**Benefits**:
- Works without JavaScript
- Automatic CSRF protection
- Type-safe with TypeScript

#### 3. API Routes

**Pattern**: REST-like endpoints
```typescript
// +server.ts
export async function GET({ url }) {
    const query = url.searchParams.get('q');
    const data = await fetchData(query);
    return json(data);
}

export async function POST({ request }) {
    const body = await request.json();
    // Process
    return json({ success: true });
}
```

**Benefits**:
- Can be called from client-side
- Standard HTTP methods
- Easy to document and test

### Frontend-Database Connection

```
Frontend (Svelte Components)
    ↓
SvelteKit Load Functions / Form Actions
    ↓
Database Helper Functions (src/lib/server/db/reports.ts)
    ↓
Drizzle ORM
    ↓
PostgreSQL Database
```

#### Connection Flow

1. **Component renders** → Requests data
2. **Load function** → Calls database helper
3. **Database helper** → Uses Drizzle ORM
4. **Drizzle ORM** → Executes SQL query
5. **PostgreSQL** → Returns results
6. **Component** → Displays data

### Required Bridges Implementation

#### 1. Authentication Bridge (TO IMPLEMENT)

**Location**: `sanadmin/src/lib/server/auth/index.ts`

```typescript
// Current: Placeholder
// Required: Full authentication system

import { hash, verify } from '@node-rs/argon2';
import { db } from '../db/index.js';
import { user, session } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return await hash(password);
}

// Verify password
export async function verifyPassword(
    hash: string,
    password: string
): Promise<boolean> {
    return await verify(hash, password);
}

// Create session
export async function createSession(userId: string): Promise<string> {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await db.insert(session).values({
        id: sessionId,
        userId,
        expiresAt
    });
    
    return sessionId;
}

// Validate session
export async function validateSession(sessionId: string) {
    const result = await db
        .select()
        .from(session)
        .where(eq(session.id, sessionId))
        .innerJoin(user, eq(session.userId, user.id));
    
    if (!result[0]) return null;
    if (result[0].session.expiresAt < new Date()) {
        await db.delete(session).where(eq(session.id, sessionId));
        return null;
    }
    
    return {
        user: result[0].user,
        session: result[0].session
    };
}

// Helper to generate session ID
function generateSessionId(): string {
    return crypto.randomUUID();
}
```

#### 2. Rate Limiting Bridge (TO IMPLEMENT)

**Location**: `src/lib/server/rate-limit.ts`

```typescript
// Simple in-memory rate limiter
// For production, use Redis or similar

const requests = new Map<string, number[]>();

export function rateLimit(
    ip: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
    const now = Date.now();
    const userRequests = requests.get(ip) || [];
    
    // Remove old requests outside window
    const validRequests = userRequests.filter(
        time => now - time < windowMs
    );
    
    if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
        cleanupOldEntries(windowMs);
    }
    
    return true; // Request allowed
}

function cleanupOldEntries(windowMs: number) {
    const now = Date.now();
    for (const [ip, times] of requests.entries()) {
        const valid = times.filter(t => now - t < windowMs);
        if (valid.length === 0) {
            requests.delete(ip);
        } else {
            requests.set(ip, valid);
        }
    }
}
```

#### 3. CORS Configuration (if needed)

**Location**: `svelte.config.js`

```javascript
// For cross-origin requests between sanandem and sanadmin
const config = {
    kit: {
        // ...
        csrf: {
            checkOrigin: true,
        }
    }
};
```

### Security Considerations

1. **API Security**:
   - Rate limiting on all public endpoints
   - Input validation and sanitization
   - CSRF protection (automatic in SvelteKit)
   - SQL injection prevention (Drizzle ORM handles this)

2. **Authentication Security**:
   - Argon2 password hashing
   - Secure session management
   - HttpOnly cookies for session tokens
   - HTTPS only in production

3. **Data Privacy**:
   - IP address hashing (never store plain IPs)
   - Optional demographic data
   - No PII collection
   - Data export anonymization

---

## Cost Analysis

### Monthly Cost Comparison

#### Option 1: Vercel + Supabase (RECOMMENDED)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Vercel (Sanandem) | Pro | $20 | 1 TB bandwidth, 1000 GB-hours |
| Vercel (Sanadmin) | Pro | $20 | Separate app |
| Supabase | Pro | $25 | 8 GB database, daily backups |
| **Total** | | **$65/month** | Production-ready |

**Estimated scaling costs:**
- At 10k users/month: ~$65/month
- At 100k users/month: ~$85-120/month
- At 1M users/month: ~$200-400/month

---

#### Option 2: Railway (Budget)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Railway | Developer | $10-20 | 2 apps + database |
| **Total** | | **$10-20/month** | Basic production |

**Estimated scaling costs:**
- At 10k users/month: ~$20/month
- At 100k users/month: ~$50-80/month
- More expensive at high scale

---

#### Option 3: Netlify + Supabase

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Netlify (2 apps) | Pro | $38 | ($19 each) |
| Supabase | Pro | $25 | 8 GB database |
| **Total** | | **$63/month** | Similar to Vercel |

---

#### Option 4: Self-Hosted (VPS)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| DigitalOcean Droplet | 4 GB RAM | $24 | 2 vCPUs, 80 GB SSD |
| Managed PostgreSQL | 1 GB | $15 | Includes backups |
| CDN (Cloudflare) | Free | $0 | Good performance |
| **Total** | | **$39/month** | Requires DevOps |

**Trade-offs:**
- ✅ More control
- ❌ Requires DevOps skills
- ❌ Manual scaling
- ❌ No managed features

---

### Free Tier Options (Development Only)

| Service | Limits | Suitable For |
|---------|--------|--------------|
| Vercel Hobby | 100 GB bandwidth | Development, demos |
| Netlify Free | 100 GB bandwidth | Small projects |
| Railway Trial | $5 credit | Testing only |
| Supabase Free | 500 MB database | MVP, testing |
| Render Free | Spins down after 15 min | Not recommended |

**Note**: Free tiers are NOT recommended for production due to:
- Database size limits
- Bandwidth caps
- Service pausing/downtime
- No backups or SLA
- Limited support

---

## Implementation Roadmap

### Phase 1: Development Environment Setup (Week 1)

#### Tasks
- [ ] Choose database solution (Recommendation: Supabase Free for dev)
- [ ] Set up development database
- [ ] Run SQL initialization script
- [ ] Configure environment variables locally
- [ ] Test both apps locally with real database
- [ ] Create initial admin user

#### Deliverables
- Working local development environment
- Populated database with test data
- Documented local setup process

---

### Phase 2: Production Database Setup (Week 1-2)

#### Tasks
- [ ] Create Supabase Pro account
- [ ] Provision production PostgreSQL database
- [ ] Run production SQL setup script
- [ ] Configure connection pooling
- [ ] Set up daily backups
- [ ] Create database monitoring alerts
- [ ] Test connection from local apps

#### Deliverables
- Production-ready PostgreSQL database
- Backup strategy implemented
- Connection strings documented

---

### Phase 3: Authentication Implementation (Week 2-3)

#### Tasks for Sanadmin
- [ ] Implement password hashing functions
- [ ] Implement session management
- [ ] Create login page
- [ ] Create logout functionality
- [ ] Add authentication middleware
- [ ] Protect admin routes
- [ ] Test authentication flow
- [ ] Create initial admin user in production

#### Deliverables
- Working authentication system
- Protected admin routes
- Session management
- Admin user created

---

### Phase 4: Sanandem Production Deployment (Week 3)

#### Tasks
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set production environment variables
- [ ] Deploy to Vercel
- [ ] Test all functionality in production
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring and error tracking

#### Deliverables
- Sanandem live in production
- Custom domain configured (if applicable)
- Monitoring active
- Performance baseline established

---

### Phase 5: Sanadmin Production Deployment (Week 3-4)

#### Tasks
- [ ] Deploy Sanadmin to Vercel (separate project)
- [ ] Set production environment variables
- [ ] Test authentication in production
- [ ] Verify database access
- [ ] Test all admin functions
- [ ] Set up IP whitelist (if needed)
- [ ] Configure custom domain
- [ ] Set up admin alerting

#### Deliverables
- Sanadmin live in production
- Admin access working
- Audit logging functional

---

### Phase 6: Rate Limiting & Security (Week 4)

#### Tasks
- [ ] Implement rate limiting on public API
- [ ] Add CAPTCHA to report submission (optional)
- [ ] Set up DDoS protection
- [ ] Security audit of all endpoints
- [ ] Implement request logging
- [ ] Set up security headers
- [ ] Configure CORS properly
- [ ] Test security measures

#### Deliverables
- Rate limiting active
- Security hardened
- Monitoring in place

---

### Phase 7: Monitoring & Optimization (Week 4-5)

#### Tasks
- [ ] Set up application monitoring (Sentry/LogRocket)
- [ ] Configure database query monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerting rules
- [ ] Optimize slow queries
- [ ] Implement caching strategy
- [ ] Add database indexes if needed
- [ ] Performance testing

#### Deliverables
- Monitoring dashboards
- Performance optimizations
- Alert system configured

---

### Phase 8: Documentation & Handoff (Week 5)

#### Tasks
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create database maintenance schedule
- [ ] Document backup/restore procedures
- [ ] Create admin user guide
- [ ] Document API endpoints
- [ ] Handoff to team

#### Deliverables
- Complete deployment documentation
- Operations runbook
- Admin guide
- API documentation

---

## Appendices

### A. Checklist for Production Launch

#### Pre-Launch
- [ ] Database schema deployed
- [ ] All environment variables configured
- [ ] Authentication working
- [ ] Rate limiting active
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] SSL certificates active
- [ ] Custom domains configured
- [ ] DNS configured correctly

#### Security
- [ ] No secrets in code
- [ ] Environment variables encrypted
- [ ] HTTPS enforced
- [ ] CSRF protection enabled
- [ ] Rate limiting active
- [ ] IP hashing implemented
- [ ] Session security configured
- [ ] SQL injection protection verified

#### Performance
- [ ] Database indexes created
- [ ] Query performance tested
- [ ] Caching strategy implemented
- [ ] CDN configured
- [ ] Image optimization done
- [ ] Build optimization done

#### Monitoring
- [ ] Uptime monitoring active
- [ ] Error tracking configured
- [ ] Performance monitoring set up
- [ ] Database monitoring active
- [ ] Alerts configured
- [ ] Logs aggregated

---

### B. Emergency Contacts & Resources

#### Platform Support
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Railway Support**: https://railway.app/help

#### Community Resources
- **SvelteKit Discord**: https://svelte.dev/chat
- **Supabase Discord**: https://discord.supabase.com
- **PostgreSQL Mailing Lists**: https://www.postgresql.org/list/

---

### C. Additional Resources

#### Documentation
- SvelteKit: https://kit.svelte.dev/
- Drizzle ORM: https://orm.drizzle.team/
- PostgreSQL: https://www.postgresql.org/docs/
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs

#### Security
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- SvelteKit Security: https://kit.svelte.dev/docs/security

---

## Conclusion

This document provides a comprehensive analysis of deployment options for the Sanandem platform. The recommended architecture (Vercel + Supabase) offers the best balance of:

- **Performance**: Global edge network with <100ms latency
- **Scalability**: Automatic scaling for both apps
- **Reliability**: 99.99% uptime SLA
- **Developer Experience**: Simple deployment and monitoring
- **Cost**: ~$65/month for production-ready setup

The implementation roadmap provides a clear 5-week path to production deployment with all necessary bridges, security measures, and monitoring in place.

### Next Steps

1. **Review this document** with the team
2. **Choose deployment architecture** (recommended or alternative)
3. **Approve budget** for hosting services
4. **Begin Phase 1** - Development environment setup
5. **Follow roadmap** through to production launch

---

**Document End**
