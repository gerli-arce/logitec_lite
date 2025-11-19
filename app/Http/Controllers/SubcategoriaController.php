<?php

namespace App\Http\Controllers;

use App\Models\Subcategoria;
use Illuminate\Http\Request;

class SubcategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Subcategoria::where('activo', true)->with('categoria')->get());
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:subcategorias',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $subcategoria = Subcategoria::create($validated);

        return response()->json($subcategoria, 201);
    }

    public function show(Subcategoria $subcategoria)
    {
        return response()->json($subcategoria);
    }

    public function update(Request $request, Subcategoria $subcategoria)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => 'string|unique:subcategorias,slug,' . $subcategoria->id,
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $subcategoria->update($validated);

        return response()->json($subcategoria);
    }

    public function destroy(Subcategoria $subcategoria)
    {
        $this->authorize('isAdmin', auth()->user());

        $subcategoria->delete();

        return response()->json(['message' => 'Subcategoría eliminada']);
    }
}
