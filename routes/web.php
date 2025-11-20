<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/setup-storage', function () {
    try {
        Artisan::call('storage:link');
        return 'Storage link created successfully. You can now see your images.';
    } catch (\Exception $e) {
        return 'Error creating storage link: ' . $e->getMessage();
    }
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
