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

# Seed roles
echo "Setting up roles..."
php artisan db:seed --class=RoleSeeder --force

# Seed users
echo "Creating test users..."
php artisan app:seed-system-users

# Clear cache
echo "Optimizing application..."
php artisan config:clear
php artisan cache:clear
php artisan optimize

# Create storage link if not exists
php artisan storage:link

echo "Starting Apache..."
exec apache2-foreground