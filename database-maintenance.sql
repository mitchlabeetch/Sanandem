-- ============================================
-- Database Maintenance Script
-- ============================================
-- 
-- Run this script periodically (daily/weekly) to maintain
-- database performance and clean up expired data
-- 
-- USAGE:
--   psql $DATABASE_URL -f database-maintenance.sql
-- 
-- Or set up as a cron job:
--   0 2 * * * psql $DATABASE_URL -f /path/to/database-maintenance.sql
-- 
-- ============================================

-- Start transaction
BEGIN;

-- ============================================
-- CLEANUP EXPIRED DATA
-- ============================================

-- Clean expired sessions
DO $$
DECLARE
    session_count INTEGER;
BEGIN
    session_count := clean_expired_sessions();
    RAISE NOTICE 'Cleaned % expired sessions', session_count;
END $$;

-- Clean expired cache entries
DO $$
DECLARE
    cache_count INTEGER;
BEGIN
    cache_count := clean_expired_cache();
    RAISE NOTICE 'Cleaned % expired cache entries', cache_count;
END $$;

-- ============================================
-- VACUUM AND ANALYZE
-- ============================================

-- Vacuum analyze for better query performance
VACUUM ANALYZE "medication_reports";
VACUUM ANALYZE "session";
VACUUM ANALYZE "statistics_cache";
VACUUM ANALYZE "audit_log";
VACUUM ANALYZE "user";

-- ============================================
-- DATABASE STATISTICS
-- ============================================

-- Display current statistics
SELECT 
    'medication_reports' as table_name,
    COUNT(*) as row_count,
    pg_size_pretty(pg_total_relation_size('medication_reports')) as total_size
FROM "medication_reports"
UNION ALL
SELECT 
    'audit_log',
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('audit_log'))
FROM "audit_log"
UNION ALL
SELECT 
    'session',
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('session'))
FROM "session"
UNION ALL
SELECT 
    'statistics_cache',
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('statistics_cache'))
FROM "statistics_cache"
UNION ALL
SELECT 
    'user',
    COUNT(*),
    pg_size_pretty(pg_total_relation_size('user'))
FROM "user";

-- ============================================
-- INDEX HEALTH CHECK
-- ============================================

-- Show index sizes
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================
-- SLOW QUERIES CHECK (if available)
-- ============================================

-- Show most time-consuming queries (requires pg_stat_statements extension)
-- Uncomment if pg_stat_statements is enabled
/*
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_exec_time DESC
LIMIT 10;
*/

-- Commit transaction
COMMIT;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'Database maintenance completed successfully';
    RAISE NOTICE '====================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Tasks performed:';
    RAISE NOTICE '  - Cleaned expired sessions';
    RAISE NOTICE '  - Cleaned expired cache entries';
    RAISE NOTICE '  - Vacuumed and analyzed all tables';
    RAISE NOTICE '  - Generated statistics report';
    RAISE NOTICE '';
    RAISE NOTICE 'Schedule this script to run periodically for optimal performance.';
    RAISE NOTICE '====================================';
END $$;
