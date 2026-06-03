#!/bin/bash

echo "Starting Ishingiro Shop System..."
echo "================================"

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Seed roles and products
echo "Setting up roles..."
php artisan db:seed --class=RoleSeeder --force
php artisan db:seed --class=ProductSeeder --force

# Seed users
echo "Creating test users..."
php artisan app:seed-system-users

# ============================================
# INITIALIZE STOCK FOR ALL PRODUCTS
# ============================================
echo "Initializing stock for all products..."
php artisan stock:init

# ============================================
# CRITICAL: Rebuild Composer Autoloader
# ============================================
echo "Rebuilding Composer autoloader..."
composer dump-autoload --optimize --no-interaction

# ============================================
# Clear all caches
# ============================================
echo "Clearing all caches..."
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# ============================================
# Re-optimize for production
# ============================================
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Create storage link if not exists
echo "Setting up storage link..."
php artisan storage:link

# ============================================
# FIX EXISTING DELIVERY NOTES
# ============================================
echo "Fixing delivery notes product names..."
php artisan fix:delivery-notes

# ============================================
# START QUEUE WORKER (Run in background)
# ============================================
echo "Starting queue worker..."
php artisan queue:work --daemon --quiet --sleep=3 --tries=3 &

# ============================================
# Also run the queue:listen as fallback
# ============================================
php artisan queue:listen --quiet &

echo "Starting Apache..."
exec apache2-foreground