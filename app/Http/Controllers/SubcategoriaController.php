<?php

namespace App\Http\Controllers;

use App\Models\Subcategoria;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Added Rule import

class SubcategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Subcategoria::where('activo', true)->with('categoria')->get());
    }

    public function indexAdmin(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Subcategoria::with('categoria');

        if ($request->filled('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->categoria_id);
        }

        $subcategorias = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json($subcategorias);
    }

    public function store(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

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
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => ['string', Rule::unique('subcategorias')->ignore($subcategoria->id)],
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|image|max:2048',
            'activo' => 'boolean',
        ]);

        $subcategoria->update($validated);

        return response()->json($subcategoria);
    }

    public function destroy(Subcategoria $subcategoria)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $subcategoria->delete();

        return response()->json(['message' => 'Subcategoría eliminada']);
    }
}
