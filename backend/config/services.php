<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
        'redirect_callback' => env('GOOGLE_REDIRECT_CALLBACK'),
        'scopes' => [
            \Google\Service\Calendar::CALENDAR_EVENTS_READONLY,
            \Google\Service\Calendar::CALENDAR_READONLY,
            \Google\Service\Oauth2::OPENID,
            \Google\Service\Oauth2::USERINFO_EMAIL,
            \Google\Service\Oauth2::USERINFO_PROFILE,
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar.events.readonly',
            'https://www.googleapis.com/auth/calendar.app.created',
            'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
            'https://www.googleapis.com/auth/calendar.events.freebusy',
            'https://www.googleapis.com/auth/calendar.events.public.readonly',
            'https://www.googleapis.com/auth/calendar.settings.readonly',
            'https://www.googleapis.com/auth/calendar.freebusy',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.acls',
            'https://www.googleapis.com/auth/calendar.acls.readonly',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.calendarlist',
            'https://www.googleapis.com/auth/calendar.calendars',
            'https://www.googleapis.com/auth/calendar.calendars.readonly',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.events.owned',
            'https://www.googleapis.com/auth/calendar.events.owned.readonly',
        ],
        'approval_prompt' => env('GOOGLE_APPROVAL_PROMPT', 'force'),
        'access_type' => env('GOOGLE_ACCESS_TYPE', 'offline'),
        'include_granted_scopes' => true,
    ],
];
