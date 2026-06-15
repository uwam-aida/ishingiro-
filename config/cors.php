<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'reset-password', 'shop/*'],

    'allowed_methods' => ['*'],

    // Allow all origins during development, specify in production
    // For production, replace with your actual frontend URLs
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://ishingiro-m4th.onrender.com',
        'https://ishingiro-shop.vercel.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set to false for token-based auth
    'supports_credentials' => false,

];