<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'reset-password', 'shop/*'],

    'allowed_methods' => ['*'],

    // PRODUCTION: Only your actual frontend domains
    'allowed_origins' => [
        'https://ishingiro-m4th.onrender.com',
        'https://ishingiro-shop.vercel.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Keep false for token-based authentication
    'supports_credentials' => false,

];