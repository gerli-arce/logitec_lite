<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::with('subcategorias')->where('activo', true)->get());
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:categorias',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $categoria = Categoria::create($validated);

        return response()->json($categoria, 201);
    }

    public function show(Categoria $categoria)
    {
        return response()->json($categoria->load('subcategorias'));
    }

    public function update(Request $request, Categoria $categoria)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => 'string|unique:categorias,slug,' . $categoria->id,
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $categoria->update($validated);

        return response()->json($categoria);
    }

    public function destroy(Categoria $categoria)
    {
        $this->authorize('isAdmin', auth()->user());

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
