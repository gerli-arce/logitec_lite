<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Added Rule import

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::with('subcategorias')->where('activo', true)->get());
    }

    public function indexAdmin(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Categoria::query();

        if ($request->filled('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        $categorias = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($categorias);
    }

    public function store(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

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
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => ['string', Rule::unique('categorias')->ignore($categoria->id)],
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $categoria->update($validated);

        return response()->json($categoria);
    }

    public function destroy(Categoria $categoria)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
