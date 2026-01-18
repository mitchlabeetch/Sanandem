CREATE INDEX IF NOT EXISTS "medication_name_lower_idx" ON "medication_reports" (lower("medication_name"));
