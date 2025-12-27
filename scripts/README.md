# Sanandem Helper Scripts

This directory contains utility scripts for setting up and managing the Sanandem platform.

## Available Scripts

### 🔐 generate-secrets.js

Generates secure random secrets for environment variables.

**Usage:**
```bash
node scripts/generate-secrets.js
```

**Output:**
- `IP_SALT`: For hashing IP addresses
- `SESSION_SECRET`: For admin session management
- `API_KEY`: Optional API authentication key

**Example:**
```bash
$ node scripts/generate-secrets.js

====================================
Sanandem Secret Keys Generator
====================================

Generated secrets for your .env files:

# For both sanandem and sanadmin
IP_SALT="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."

# For sanadmin only
SESSION_SECRET="f6e5d4c3b2a1..."

# Optional: For API authentication
API_KEY="x9y8z7w6v5u4..."
```

---

### 🔑 generate-password-hash.js

Generates Argon2 password hashes for admin users.

**Usage:**
```bash
# Interactive (prompts for password)
node scripts/generate-password-hash.js

# With password as argument
node scripts/generate-password-hash.js "MySecurePassword123!"
```

**Output:**
```
====================================
Password Hash Generated Successfully
====================================

Hash: $argon2id$v=19$m=19456,t=2,p=1$...

Use this hash in one of the following ways:

1. In create-admin.sql:
   "password_hash": "$argon2id$v=19$m=19456,t=2,p=1$..."

2. As environment variable:
   ADMIN_PASSWORD_HASH="$argon2id$v=19$m=19456,t=2,p=1$..."
```

**Security Notes:**
- Uses Argon2id algorithm (recommended for password hashing)
- Memory cost: 19456 KB
- Time cost: 2 iterations
- Never store plain text passwords!

---

### 🗄️ setup-database.sh

Automated database setup script that creates the complete schema and optionally creates an admin user.

**Prerequisites:**
- PostgreSQL client tools (`psql`)
- `DATABASE_URL` environment variable set

**Usage:**
```bash
# Set database URL
export DATABASE_URL="postgresql://user:pass@host:port/dbname"

# Run setup
./scripts/setup-database.sh
```

**What it does:**
1. Tests database connection
2. Runs `database-setup.sql` to create tables, indexes, and functions
3. Optionally runs `create-admin.sql` to create an initial admin user
4. Verifies setup was successful

**Example output:**
```
======================================
Sanandem Database Setup
======================================

Database URL: postgresql://postgres:***...
Testing database connection...
✓ Connection successful

Creating database schema...
✓ Database schema created successfully

Do you want to create an initial admin user? (y/n)
```

---

## Quick Start Guide

### 1. First-Time Setup

```bash
# Clone the repository
git clone https://github.com/mitchlabeetch/Sanandem.git
cd Sanandem

# Generate secrets
node scripts/generate-secrets.js

# Copy output to .env files
cp sanandem/.env.example sanandem/.env
cp sanadmin/.env.example sanadmin/.env
# Edit .env files with generated secrets

# Generate admin password hash
node scripts/generate-password-hash.js
# Copy hash to create-admin.sql

# Set up database
export DATABASE_URL="your-database-url"
./scripts/setup-database.sh
```

### 2. Creating Additional Admin Users

```bash
# Generate password hash
node scripts/generate-password-hash.js "SecurePassword123"

# Connect to database and run:
psql $DATABASE_URL <<EOF
INSERT INTO "user" (
    "id",
    "username",
    "password_hash",
    "role",
    "created_at"
) VALUES (
    'admin-' || gen_random_uuid()::text,
    'new_admin_username',
    'YOUR_GENERATED_HASH',
    'admin',
    NOW()
);
EOF
```

### 3. Updating Secrets (Security Rotation)

```bash
# Generate new secrets
node scripts/generate-secrets.js > new-secrets.txt

# Update .env files with new secrets
# Update Vercel environment variables (if deployed)
# Restart applications
```

---

## Development Workflow

### Local Development

```bash
# 1. Set up local database
./scripts/setup-database.sh

# 2. Install dependencies
cd sanandem && npm install
cd ../sanadmin && npm install

# 3. Start development servers
cd sanandem && npm run dev  # Port 5173
cd sanadmin && npm run dev  # Port 5174
```

### Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete production deployment guide.

Quick checklist:
```bash
# 1. Generate production secrets
node scripts/generate-secrets.js

# 2. Set up production database
export DATABASE_URL="production-database-url"
./scripts/setup-database.sh

# 3. Deploy to Vercel (or your hosting platform)
# Add environment variables from step 1
# Deploy both sanandem and sanadmin
```

---

## Troubleshooting

### Script not executable

```bash
chmod +x scripts/setup-database.sh
```

### Module not found error

```bash
# Make sure you're in the project root
cd Sanandem

# Install dependencies
npm install @node-rs/argon2
```

### Database connection failed

```bash
# Test connection manually
psql $DATABASE_URL -c "SELECT version();"

# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/dbname
```

### Password hash doesn't work

```bash
# Verify the hash was copied correctly (no line breaks)
# Regenerate if needed
node scripts/generate-password-hash.js "your-password"
```

---

## Security Best Practices

1. **Never commit secrets**: `.env` files are gitignored
2. **Use different secrets per environment**: Dev, staging, production
3. **Rotate secrets regularly**: Every 90 days recommended
4. **Store production secrets securely**: Use platform secret managers (Vercel, etc.)
5. **Generate strong passwords**: Minimum 12 characters, mix of types
6. **Hash passwords before storage**: Never store plain text passwords

---

## Additional Resources

- [Database Setup Documentation](../database-setup.sql)
- [Production Deployment Guide](../DEPLOYMENT.md)
- [Full Technical Documentation](../technew.md)
- [Project README](../README.md)

---

## Script Dependencies

All scripts use Node.js and require:
- Node.js 20+
- `@node-rs/argon2` package (for password hashing)
- `psql` command line tool (for database setup)

Install dependencies:
```bash
npm install @node-rs/argon2
```

Or if using the app dependencies:
```bash
cd sanandem && npm install
cd sanadmin && npm install
```
