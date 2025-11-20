<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('productos', 'promocion')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->boolean('promocion')->default(false)->after('precio_oferta');
            });
        }
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('promocion');
        });
    }
};
