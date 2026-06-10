<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'reset-password', 'shop/*'],

    'allowed_methods' => ['*'],

    // ✅ FIX: 'allowed_origins' must NOT mix '*' with specific origins.
    // When using wildcard '*', all origins are allowed already.
    // Keeping specific origins here for clarity and security.
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

    // ✅ Keep false unless you are using cookie-based Sanctum SPA auth.
    // Token-based (Bearer) auth does NOT need credentials.
    'supports_credentials' => false,

];