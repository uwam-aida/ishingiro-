#!/bin/bash

echo "🚀 Starting ishingiro Shop System..."
echo "================================"

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate --force

# Seed roles (only if not exist)
echo "👥 Checking roles..."
php artisan db:seed --class=RoleSeeder --force

# Seed test users
echo "👤 Creating test users..."
php artisan app:seed-system-users

# Optimize Laravel
echo "⚡ Optimizing application..."
php artisan optimize

echo "✅ Starting server..."
php artisan serve --host=0.0.0.0 --port=$PORT