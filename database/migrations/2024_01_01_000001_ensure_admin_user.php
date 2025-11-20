<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        $user = User::where('email', 'admin@logitec.com')->first();
        
        if ($user) {
            $user->role = 'admin';
            $user->save();
        } else {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@logitec.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]);
        }
    }

    public function down(): void
    {
        // No revert needed
    }
};
