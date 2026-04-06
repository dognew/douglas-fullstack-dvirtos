<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BootController;

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'D-VirtOS API',
        'version' => '1.0.0'
    ]);
});

Route::get('/api/boot-specs', [BootController::class, 'getSpecs']);

/**
 * System Module: Application Discovery
 * Scans /public/dvirtos/usr/share/applications for JSON manifests.
 * Uses glob to ensure symbolic links are correctly followed.
 */
/**
 * System Module: Application Discovery
 * Scans /public/dvirtos/usr/share/applications for JSON manifests.
 * Uses realpath and glob to ensure symbolic links are correctly followed.
 */
Route::get('/api/system/applications', function () {
    $path = realpath(public_path('dvirtos/usr/share/applications'));
    
    // Check if path exists and is a directory after resolving symlink
    if (!$path || !is_dir($path)) {
        return response()->json([]);
    }

    // glob handles symlinks reliably on resolved paths
    $files = glob($path . "/*.json");
    
    if (!$files) {
        return response()->json([]);
    }

    // Returns only the filenames (e.g., "welcome.json")
    $manifests = array_map('basename', $files);

    return response()->json(array_values($manifests));
});