#!/bin/bash

echo "Starting Ishingiro Shop System..."
echo "================================"

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Seed roles
echo "Setting up roles..."
php artisan db:seed --class=RoleSeeder --force

# Seed users
echo "Creating test users..."
php artisan app:seed-system-users

# Clear and cache
echo "⚡ Optimizing..."
php artisan optimize

# Start Apache
echo "Starting Apache..."
apache2-foreground