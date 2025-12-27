# CI/CD Recommendations for Sanandem

This document outlines recommended Continuous Integration and Continuous Deployment (CI/CD) strategies for the Sanandem platform.

## Overview

A robust CI/CD pipeline ensures:
- ✅ Automated testing on every commit
- ✅ Consistent build process
- ✅ Automated deployments to staging/production
- ✅ Quality gates before production release
- ✅ Rollback capabilities

## Recommended Architecture

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Developer pushes to branch                                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Actions: CI Pipeline                                      │
│  1. Install dependencies                                         │
│  2. Run linters (ESLint, Prettier)                               │
│  3. Run type checking (TypeScript)                               │
│  4. Run unit tests                                               │
│  5. Run E2E tests                                                │
│  6. Build application                                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ├─────── If PR → Create preview deployment (Vercel)
                 │
                 └─────── If main branch → Deploy to production
```

## Recommended Platform: GitHub Actions + Vercel

### Why This Combination?

1. **Native Integration**: GitHub Actions built into GitHub
2. **Vercel Auto-Deploy**: Automatic preview deployments for PRs
3. **Zero Configuration**: Minimal setup required
4. **Cost**: Free for public repositories
5. **Performance**: Fast build times

## GitHub Actions Workflows

### 1. Continuous Integration (CI) Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ============================================
  # Sanandem (Public App) CI
  # ============================================
  sanandem-ci:
    name: Sanandem CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sanandem
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: sanandem/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type checking
        run: npm run check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          IP_SALT: ${{ secrets.IP_SALT }}
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
  
  # ============================================
  # Sanadmin (Admin App) CI
  # ============================================
  sanadmin-ci:
    name: Sanadmin CI
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./sanadmin
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: sanadmin/package-lock.json
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type checking
        run: npm run check
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          IP_SALT: ${{ secrets.IP_SALT }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
```

### 2. Security Scanning Workflow

Create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Run weekly on Mondays at 9am
    - cron: '0 9 * * 1'

jobs:
  security-scan:
    name: Security Audit
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Audit sanandem dependencies
        working-directory: ./sanandem
        run: npm audit --audit-level=moderate
      
      - name: Audit sanadmin dependencies
        working-directory: ./sanadmin
        run: npm audit --audit-level=moderate
      
      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v3
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

### 3. Database Migration Workflow (Optional)

Create `.github/workflows/db-migration.yml`:

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  migrate:
    name: Run Database Migration
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./sanandem
        run: npm ci
      
      - name: Run migrations
        working-directory: ./sanandem
        run: npm run db:push
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Notify on Slack
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Database migration completed for ${{ github.event.inputs.environment }}"
            }
```

## Vercel Configuration

### Automatic Deployments

Vercel automatically:
1. Creates preview deployments for every PR
2. Deploys to production on merge to main
3. Runs build checks
4. Provides deployment URLs

### Configure Vercel

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "sanandem/package.json",
      "use": "@vercel/node"
    },
    {
      "src": "sanadmin/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/sanandem/(.*)",
      "dest": "sanandem/$1"
    },
    {
      "src": "/sanadmin/(.*)",
      "dest": "sanadmin/$1"
    }
  ]
}
```

### Branch-Specific Deployments

In Vercel dashboard:
1. **Production Branch**: `main`
2. **Preview Branches**: All other branches
3. **Build Settings**:
   - Sanandem: Root = `sanandem`
   - Sanadmin: Root = `sanadmin`

## Environment Management

### Environment Hierarchy

```
Development (Local)
    ↓
Staging (Vercel Preview)
    ↓
Production (Vercel Production)
```

### GitHub Secrets Configuration

Add these secrets to GitHub repository (Settings → Secrets and variables → Actions):

**For CI/CD:**
- `DATABASE_URL`: Test database connection string
- `TEST_DATABASE_URL`: Separate test database
- `IP_SALT`: For testing (generate unique one)
- `SESSION_SECRET`: For admin tests

**For Deployments:**
- `VERCEL_TOKEN`: Vercel API token (if manual deployment)
- `SLACK_WEBHOOK`: For notifications (optional)
- `SENTRY_AUTH_TOKEN`: For error tracking (optional)

### Vercel Environment Variables

Configure in Vercel dashboard per project:

**Sanandem:**
- `DATABASE_URL` (Production)
- `IP_SALT` (Production)
- `NODE_ENV=production`

**Sanadmin:**
- `DATABASE_URL` (Production)
- `IP_SALT` (Production)
- `SESSION_SECRET` (Production)
- `NODE_ENV=production`

## Deployment Strategies

### 1. Preview Deployments (Automatic)

**Trigger**: Every PR created/updated

**Process**:
1. GitHub Actions runs CI checks
2. Vercel creates preview deployment
3. Unique URL generated for testing
4. Comment added to PR with URL

**Benefits**:
- Test changes before merge
- Share with team/stakeholders
- No impact on production

### 2. Staging Deployments

**Trigger**: Merge to `develop` branch

**Process**:
1. CI checks pass
2. Deploy to staging environment
3. Run smoke tests
4. Notify team

**Configuration**:
```yaml
# Add to ci.yml
staging-deploy:
  name: Deploy to Staging
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/develop'
  needs: [sanandem-ci, sanadmin-ci]
  
  steps:
    - name: Deploy to Vercel Staging
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        scope: ${{ secrets.VERCEL_SCOPE }}
```

### 3. Production Deployments

**Trigger**: Merge to `main` branch

**Process**:
1. All CI checks pass
2. Staging tests pass
3. Manual approval (optional)
4. Deploy to production
5. Run post-deployment tests
6. Notify team

**With Manual Approval**:
```yaml
production-deploy:
  name: Deploy to Production
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  needs: [sanandem-ci, sanadmin-ci]
  environment: 
    name: production
    url: https://sanandem.com
  
  steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Deploy to Vercel Production
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-args: '--prod'
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    
    - name: Run smoke tests
      run: |
        npm install -g wait-on
        wait-on https://sanandem.com
        curl -f https://sanandem.com/api/reports || exit 1
```

## Quality Gates

### Before Deployment

Required checks before production deployment:

1. ✅ All unit tests pass
2. ✅ All E2E tests pass
3. ✅ No linting errors
4. ✅ Type checking passes
5. ✅ Security audit passes (no critical/high vulnerabilities)
6. ✅ Code review approved (minimum 1 reviewer)
7. ✅ Build succeeds

### After Deployment

Post-deployment verification:

1. ✅ Health check endpoint responds
2. ✅ Database connection working
3. ✅ API endpoints responding
4. ✅ No errors in monitoring

## Rollback Strategy

### Automatic Rollback

If deployment fails:
1. GitHub Actions detects failure
2. Triggers rollback workflow
3. Reverts to previous deployment
4. Notifies team

### Manual Rollback

In Vercel dashboard:
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Confirm rollback

## Monitoring & Notifications

### Slack Notifications

```yaml
- name: Notify Slack on Success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Deployment successful to ${{ github.event.inputs.environment }}"
      }

- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ Deployment failed for ${{ github.event.inputs.environment }}"
      }
```

### Email Notifications

Configure in GitHub repository settings:
- Settings → Notifications
- Enable workflow notifications
- Add team members

## Best Practices

### 1. Branch Protection Rules

Configure in GitHub (Settings → Branches):

**For `main` branch:**
- ✅ Require pull request before merging
- ✅ Require approvals (minimum 1)
- ✅ Require status checks to pass:
  - `sanandem-ci`
  - `sanadmin-ci`
  - `security-scan`
- ✅ Require branches to be up to date
- ✅ Include administrators

### 2. Commit Message Convention

Use conventional commits:
```
feat: add new visualization component
fix: resolve database connection issue
docs: update deployment guide
test: add E2E tests for report submission
chore: update dependencies
```

### 3. Version Tagging

Tag releases for production:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 4. Changelog Maintenance

Keep CHANGELOG.md updated with each release.

## Cost Considerations

### GitHub Actions

**Free Tier:**
- 2,000 minutes/month for private repos
- Unlimited for public repos

**Estimated Usage:**
- CI per commit: ~5-10 minutes
- ~200-400 commits/month = ~1,000-4,000 minutes
- For private repos: $8-16/month

### Vercel

**Hobby (Free):**
- 100 deployments/day
- 100 GB bandwidth
- Sufficient for small teams

**Pro ($20/month per member):**
- Unlimited deployments
- 1 TB bandwidth
- Team features
- Required for production

## Alternative: Railway CI/CD

If using Railway instead of Vercel:

1. **Automatic Deployments**: Railway auto-deploys on git push
2. **Environment Variables**: Configure in Railway dashboard
3. **Rollback**: One-click rollback in Railway UI
4. **Cost**: Included in Railway pricing

## Conclusion

Recommended setup:
1. **Start with**: GitHub Actions + Vercel auto-deploy
2. **Add as needed**: 
   - Security scanning
   - Staging environment
   - Manual approval gates
3. **Monitor**: Deployment success rates
4. **Iterate**: Improve based on team needs

---

For questions or issues, see [GitHub Issues](https://github.com/mitchlabeetch/Sanandem/issues).
