<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json(Setting::all());
    }

    public function show($clave)
    {
        $setting = Setting::where('clave', $clave)->first();

        if (!$setting) {
            return response()->json(['error' => 'Setting no encontrado'], 404);
        }

        return response()->json($setting);
    }

    public function update(Request $request, $clave)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'valor' => 'required',
        ]);

        $setting = Setting::updateOrCreate(
            ['clave' => $clave],
            ['valor' => $validated['valor']]
        );

        return response()->json($setting);
    }
}
