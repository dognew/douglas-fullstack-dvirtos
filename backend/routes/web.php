<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BootController;

// Opcional: Redireciona a raiz do backend para o status da API ou apenas retorna um JSON
Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'D-VirtOS API',
        'version' => '1.0.0'
    ]);
});

// Rota para fornecer os dados de hardware ao React
Route::get('/api/boot-specs', [BootController::class, 'getSpecs']);