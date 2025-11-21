<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SubcategoriaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SettingController;

// Rutas públicas
Route::post('/auth/login', [AuthController::class, 'login']);

// Recursos públicos
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{categoria}', [CategoriaController::class, 'show']);
Route::get('/subcategorias', [SubcategoriaController::class, 'index']);
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/destacados', [ProductoController::class, 'destacados']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/slug/{slug}', [PostController::class, 'showBySlug']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/settings', [SettingController::class, 'index']);

// Rutas protegidas (Admin)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Admin - Categorías
    Route::get('/admin/categorias', [CategoriaController::class, 'indexAdmin']); // Added admin route
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);
    
    // Admin - Subcategorías
    Route::get('/admin/subcategorias', [SubcategoriaController::class, 'indexAdmin']); // Added admin route
    Route::post('/subcategorias', [SubcategoriaController::class, 'store']);
    Route::put('/subcategorias/{subcategoria}', [SubcategoriaController::class, 'update']);
    Route::delete('/subcategorias/{subcategoria}', [SubcategoriaController::class, 'destroy']);
    
    // Admin - Productos
    Route::get('/admin/productos', [ProductoController::class, 'indexAdmin']); // Added admin specific route for fetching products
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::put('/productos/{id}', [ProductoController::class, 'update']);
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);
    
    // Admin - Posts
    Route::get('/admin/posts', [PostController::class, 'indexAdmin']); // Added admin route for posts
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    
    // Admin - Settings
    Route::put('/settings', [SettingController::class, 'update']);
});
