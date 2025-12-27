-- ============================================
-- Sanandem Database Setup Script
-- PostgreSQL 14+
-- Version: 1.0
-- Last Updated: 2024-12-26
-- ============================================
-- 
-- This script sets up the complete database schema for Sanandem
-- including tables, indexes, functions, and triggers.
-- 
-- USAGE:
--   psql $DATABASE_URL -f database-setup.sql
-- 
-- OR via npm script (recommended):
--   npm run db:setup
-- 
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
    "username" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "last_login_at" TIMESTAMP,
    CONSTRAINT "user_role_check" CHECK ("role" IN ('admin', 'superadmin'))
);

CREATE INDEX IF NOT EXISTS "idx_user_username" ON "user"("username");
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "user"("role");

COMMENT ON TABLE "user" IS 'Admin users for the sanadmin dashboard';
COMMENT ON COLUMN "user"."role" IS 'User role: admin or superadmin';

-- Session management table
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_session_user_id" ON "session"("user_id");
CREATE INDEX IF NOT EXISTS "idx_session_expires_at" ON "session"("expires_at");

COMMENT ON TABLE "session" IS 'Active admin user sessions';

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

-- Performance indexes
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

-- GIN indexes for JSONB fields (faster array searches)
CREATE INDEX IF NOT EXISTS "idx_medication_reports_side_effects" 
    ON "medication_reports" USING GIN("side_effects");

CREATE INDEX IF NOT EXISTS "idx_medication_reports_positive_effects" 
    ON "medication_reports" USING GIN("positive_effects");

-- Text search index for medication names (fuzzy matching)
CREATE INDEX IF NOT EXISTS "idx_medication_reports_medication_name_trgm" 
    ON "medication_reports" USING GIN("medication_name" gin_trgm_ops);

COMMENT ON TABLE "medication_reports" IS 'Anonymous medication side effect reports submitted by users';
COMMENT ON COLUMN "medication_reports"."ip_hash" IS 'Hashed IP address for abuse prevention (not identifying)';
COMMENT ON COLUMN "medication_reports"."is_anonymized" IS 'Flag indicating if data is anonymized (should always be true)';

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

COMMENT ON TABLE "audit_log" IS 'Audit trail of admin actions for compliance and security';

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

COMMENT ON TABLE "statistics_cache" IS 'Cached aggregated statistics for performance optimization';

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

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at column on row modification';

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

COMMENT ON FUNCTION clean_expired_sessions() IS 'Removes expired sessions from the database. Should be run periodically (e.g., daily cron job)';

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

COMMENT ON FUNCTION clean_expired_cache() IS 'Removes expired cache entries. Should be run periodically (e.g., hourly)';

-- ============================================
-- UTILITY VIEWS
-- ============================================

-- View for recent reports (useful for dashboard)
CREATE OR REPLACE VIEW recent_reports AS
SELECT 
    "id",
    "medication_name",
    "medication_dosage",
    "side_effects",
    "severity",
    "age_group",
    "gender",
    "is_verified",
    "created_at"
FROM "medication_reports"
ORDER BY "created_at" DESC
LIMIT 100;

COMMENT ON VIEW recent_reports IS 'Most recent 100 medication reports for quick dashboard access';

-- View for statistics (commonly used aggregations)
CREATE OR REPLACE VIEW report_statistics AS
SELECT 
    COUNT(*) as total_reports,
    COUNT(DISTINCT "medication_name") as unique_medications,
    AVG("severity") as avg_severity,
    COUNT(*) FILTER (WHERE "is_verified" = true) as verified_reports,
    COUNT(*) FILTER (WHERE "gender" = 'female') as female_reports,
    COUNT(*) FILTER (WHERE "gender" = 'male') as male_reports
FROM "medication_reports";

COMMENT ON VIEW report_statistics IS 'Aggregated statistics about medication reports';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Display table information
DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Sanandem Database Setup Complete';
    RAISE NOTICE '====================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - user (admin users)';
    RAISE NOTICE '  - session (admin sessions)';
    RAISE NOTICE '  - medication_reports (main data)';
    RAISE NOTICE '  - audit_log (compliance tracking)';
    RAISE NOTICE '  - statistics_cache (performance)';
    RAISE NOTICE '';
    RAISE NOTICE 'Views created:';
    RAISE NOTICE '  - recent_reports';
    RAISE NOTICE '  - report_statistics';
    RAISE NOTICE '';
    RAISE NOTICE 'Functions created:';
    RAISE NOTICE '  - update_updated_at_column()';
    RAISE NOTICE '  - clean_expired_sessions()';
    RAISE NOTICE '  - clean_expired_cache()';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Create initial admin user (see create-admin.sql)';
    RAISE NOTICE '  2. Set up periodic cleanup jobs';
    RAISE NOTICE '  3. Configure connection pooling (if using Supabase)';
    RAISE NOTICE '  4. Run initial data migration (if applicable)';
    RAISE NOTICE '';
    RAISE NOTICE 'For verification, run: SELECT * FROM report_statistics;';
    RAISE NOTICE '====================================';
END $$;

-- Quick verification query
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_schema = 'public' 
     AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
