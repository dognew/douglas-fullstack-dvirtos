<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/*
|--------------------------------------------------------------------------
| Environment Path Discovery logic
|--------------------------------------------------------------------------
| Identify if we are running on the Hostgator production server 
| or inside a local Docker container/development environment.
*/
$basePath = dirname(__DIR__);
$productionEnvPath = '/home/dognew52/dvirtos_secrets';

// Determine the correct path for the .env file
$envPath = is_dir($productionEnvPath) ? $productionEnvPath : $basePath;

return Application::configure(basePath: $basePath)
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->prepend(\App\Http\Middleware\ForceJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create()
    ->useEnvironmentPath($envPath); // Dynamically set the .env location