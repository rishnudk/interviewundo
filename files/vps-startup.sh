#!/bin/bash
# =============================================================================
# InterviewUndo VPS — Full Auto-Recovery Startup Script
# Location on VPS: /root/startup.sh
# Triggered by:    crontab (@reboot)
# Purpose:         Fully restore all services after any VPS reboot/kernel upgrade
# Last Updated:    2026-07-27
# =============================================================================

LOG="/var/log/vps-startup.log"
COMPOSE_DIR="/root/redis-prod"
PROJECT_DIR="/var/www/interview-undo"

echo "" >> "$LOG"
echo "============================================================" >> "$LOG"
echo "VPS STARTUP: $(date)" >> "$LOG"
echo "============================================================" >> "$LOG"

# -----------------------------------------------------------------------------
# STEP 1: Wait for Docker daemon to be fully ready
# -----------------------------------------------------------------------------
echo "[1/6] Waiting for Docker daemon..." >> "$LOG"
sleep 15

until docker info > /dev/null 2>&1; do
    echo "  Docker not ready yet, waiting 5s..." >> "$LOG"
    sleep 5
done
echo "  ✓ Docker is ready." >> "$LOG"

# -----------------------------------------------------------------------------
# STEP 2: Start all database/service containers (Postgres, Redis, Mongo, n8n)
# -----------------------------------------------------------------------------
echo "[2/6] Starting Docker containers (Postgres, Redis, Mongo, n8n)..." >> "$LOG"
cd "$COMPOSE_DIR" || { echo "  ✗ FAILED: $COMPOSE_DIR not found" >> "$LOG"; exit 1; }

docker compose up -d >> "$LOG" 2>&1
sleep 10  # Give containers time to initialize

echo "  Running containers:" >> "$LOG"
docker ps --format "  - {{.Names}} ({{.Status}})" >> "$LOG"

# -----------------------------------------------------------------------------
# STEP 3: Pull base Docker image for code runners and clean up locks
# -----------------------------------------------------------------------------
echo "[3/6] Cleaning up old dummy locks and pulling base image..." >> "$LOG"

# Remove old dummy container locks so we can safely rebuild/update images
docker rm -f dummy-node-base dummy-mongodb-runner dummy-react-runner dummy-sql-runner >> "$LOG" 2>&1

docker pull node:22-slim >> "$LOG" 2>&1
if [ $? -eq 0 ]; then
    echo "  ✓ node:22-slim pulled." >> "$LOG"
else
    echo "  ✗ WARNING: Failed to pull node:22-slim (no internet?)" >> "$LOG"
fi

# -----------------------------------------------------------------------------
# STEP 4: Build runner images and lock them against pruning
# -----------------------------------------------------------------------------
echo "[4/6] Building runner images..." >> "$LOG"
cd "$PROJECT_DIR" || { echo "  ✗ FAILED: $PROJECT_DIR not found" >> "$LOG"; exit 1; }

echo "  Building node-mongodb-runner..." >> "$LOG"
docker build -t node-mongodb-runner:latest -f infrastructure/docker/Dockerfile.mongodb-runner . >> "$LOG" 2>&1
if [ $? -eq 0 ]; then echo "  ✓ node-mongodb-runner:latest built." >> "$LOG"; else echo "  ✗ FAILED: node-mongodb-runner" >> "$LOG"; fi

echo "  Building node-react-runner..." >> "$LOG"
docker build -t node-react-runner:latest -f infrastructure/docker/Dockerfile.react-runner . >> "$LOG" 2>&1
if [ $? -eq 0 ]; then echo "  ✓ node-react-runner:latest built." >> "$LOG"; else echo "  ✗ FAILED: node-react-runner" >> "$LOG"; fi

echo "  Building node-sql-runner..." >> "$LOG"
docker build -t node-sql-runner:latest -f infrastructure/docker/Dockerfile.sql-runner . >> "$LOG" 2>&1
if [ $? -eq 0 ]; then echo "  ✓ node-sql-runner:latest built." >> "$LOG"; else echo "  ✗ FAILED: node-sql-runner" >> "$LOG"; fi

echo "  Creating dummy container locks to prevent automatic pruning..." >> "$LOG"
docker create --name dummy-node-base node:22-slim >> "$LOG" 2>&1
docker create --name dummy-mongodb-runner node-mongodb-runner:latest >> "$LOG" 2>&1
docker create --name dummy-react-runner node-react-runner:latest >> "$LOG" 2>&1
docker create --name dummy-sql-runner node-sql-runner:latest >> "$LOG" 2>&1
echo "  ✓ Dummy container locks created." >> "$LOG"

echo "  All Docker images:" >> "$LOG"
docker images --format "  - {{.Repository}}:{{.Tag}} ({{.Size}})" >> "$LOG"

# -----------------------------------------------------------------------------
# STEP 5: Start PM2 processes (backend + judge worker)
# -----------------------------------------------------------------------------
echo "[5/6] Starting PM2 processes..." >> "$LOG"
cd "$PROJECT_DIR" || { echo "  ✗ FAILED: $PROJECT_DIR not found" >> "$LOG"; exit 1; }

# Kill any stale PM2 state first
pm2 kill >> "$LOG" 2>&1
sleep 3

# Start fresh from ecosystem config
pm2 start ecosystem.config.js --env production >> "$LOG" 2>&1
if [ $? -eq 0 ]; then
    echo "  ✓ PM2 processes started." >> "$LOG"
else
    echo "  ✗ WARNING: PM2 start had issues. Check pm2 list." >> "$LOG"
fi

# -----------------------------------------------------------------------------
# STEP 6: Save PM2 process list
# -----------------------------------------------------------------------------
echo "[6/6] Saving PM2 process list..." >> "$LOG"
pm2 save >> "$LOG" 2>&1
echo "  ✓ PM2 saved." >> "$LOG"

# Final status summary
echo "" >> "$LOG"
echo "--- FINAL STATUS ---" >> "$LOG"
echo "Docker containers:" >> "$LOG"
docker ps --format "  {{.Names}}: {{.Status}}" >> "$LOG"
echo "Docker runner images:" >> "$LOG"
docker images --format "  {{.Repository}}:{{.Tag}}" | grep -E "runner|node" >> "$LOG"
echo "PM2 processes:" >> "$LOG"
pm2 list --no-color 2>&1 | tail -n 20 >> "$LOG"
echo "--- STARTUP COMPLETE: $(date) ---" >> "$LOG"
