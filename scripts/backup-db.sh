#!/bin/bash

# Artifact ERP - Automated Database Backup Script
# Run this daily via cron: 0 2 * * * /path/to/backup-db.sh

set -e

# Configuration
BACKUP_DIR="/var/backups/artifact-erp"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="artifact_erp_backup_${TIMESTAMP}.sql.gz"

# Database connection (from environment or .env)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-artifact_erp_db}"
DB_USER="${DB_USER:-artifact_user}"
DB_PASSWORD="${DB_PASSWORD:-artifact_password}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of $DB_NAME..."

# Perform backup
PGPASSWORD="$DB_PASSWORD" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-owner \
  --no-acl \
  | gzip > "$BACKUP_DIR/$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "[$(date)] Backup completed successfully: $BACKUP_FILE"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Backup size: $BACKUP_SIZE"
    
    # Remove old backups (older than RETENTION_DAYS)
    find "$BACKUP_DIR" -name "artifact_erp_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "[$(date)] Cleaned up backups older than $RETENTION_DAYS days"
    
    # Optional: Upload to S3/Cloud Storage
    # aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" s3://your-bucket/backups/
    
else
    echo "[$(date)] ERROR: Backup failed!"
    exit 1
fi

echo "[$(date)] Backup process completed"
