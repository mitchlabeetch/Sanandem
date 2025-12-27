#!/bin/bash
# ============================================
# Database Setup Script
# ============================================
# 
# This script sets up the Sanandem database including:
# - Creating tables and indexes
# - Setting up functions and triggers
# - Creating an initial admin user
# 
# Prerequisites:
# - PostgreSQL installed
# - DATABASE_URL environment variable set
# - psql command available
# 
# Usage:
#   ./scripts/setup-database.sh
# 
# ============================================

set -e  # Exit on error

echo "======================================"
echo "Sanandem Database Setup"
echo "======================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set DATABASE_URL before running this script:"
    echo "  export DATABASE_URL='postgresql://user:pass@host:port/dbname'"
    echo ""
    exit 1
fi

echo "Database URL is set: ✓"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql command not found"
    echo "Please install PostgreSQL client tools"
    exit 1
fi

# Test database connection
echo "Testing database connection..."
if ! psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "ERROR: Cannot connect to database"
    echo "Please check your DATABASE_URL"
    exit 1
fi
echo "✓ Connection successful"
echo ""

# Run database setup script
echo "Creating database schema..."
if psql "$DATABASE_URL" -f database-setup.sql; then
    echo "✓ Database schema created successfully"
else
    echo "✗ Failed to create database schema"
    exit 1
fi
echo ""

# Ask if user wants to create admin user
read -p "Do you want to create an initial admin user? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "To create an admin user, you need a password hash."
    echo "Run: node scripts/generate-password-hash.js"
    echo ""
    read -p "Have you generated a password hash and updated create-admin.sql? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Creating admin user..."
        if psql "$DATABASE_URL" -f create-admin.sql; then
            echo "✓ Admin user created successfully"
        else
            echo "✗ Failed to create admin user"
        fi
    else
        echo "Skipping admin user creation"
        echo "You can create it later by running:"
        echo "  psql \$DATABASE_URL -f create-admin.sql"
    fi
fi

echo ""
echo "======================================"
echo "Database setup complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Update your .env files with the DATABASE_URL"
echo "  2. Generate secret keys: node scripts/generate-secrets.js"
echo "  3. Start the applications:"
echo "     - cd sanandem && npm run dev"
echo "     - cd sanadmin && npm run dev"
echo ""
