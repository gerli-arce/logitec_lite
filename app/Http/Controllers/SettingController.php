<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('valor', 'clave');
        return response()->json($settings);
    }

    public function show($clave)
    {
        $setting = Setting::where('clave', $clave)->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting no encontrado'], 404);
        }

        return response()->json($setting);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->all();

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['clave' => $key],
                ['valor' => $value]
            );
        }

        return response()->json(['message' => 'Configuración actualizada correctamente']);
    }
}
