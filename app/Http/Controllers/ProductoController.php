<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::where('activo', true);

        if ($request->has('categoria_id')) {
            $categoryIds = explode(',', $request->categoria_id);
            $query->whereIn('categoria_id', $categoryIds);
        }

        if ($request->has('subcategoria_id')) {
            $subcategoryIds = explode(',', $request->subcategoria_id);
            $query->whereIn('subcategoria_id', $subcategoryIds);
        }

        if ($request->has('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(15));
    }

    public function destacados()
    {
        return response()->json(Producto::where('activo', true)->where('destacado', true)->limit(6)->get());
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'subcategoria_id' => 'required|exists:subcategorias,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:productos',
            'descripcion' => 'required|string',
            'especificaciones' => 'nullable|array',
            'precio' => 'required|numeric|min:0',
            'precio_oferta' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'imagen_principal' => 'nullable|image|max:2048',
            'activo' => 'boolean',
            'destacado' => 'boolean',
        ]);

        $producto = Producto::create($validated);

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        $producto = Producto::with(['categoria', 'subcategoria'])->findOrFail($id);
        return response()->json($producto);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('isAdmin', auth()->user());
        
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => 'string|unique:productos,slug,' . $producto->id,
            'descripcion' => 'string',
            'especificaciones' => 'nullable|array',
            'precio' => 'numeric|min:0',
            'precio_oferta' => 'nullable|numeric|min:0',
            'stock' => 'integer|min:0',
            'imagen_principal' => 'nullable|image|max:2048',
            'activo' => 'boolean',
            'destacado' => 'boolean',
        ]);

        $producto->update($validated);

        return response()->json($producto);
    }

    public function destroy($id)
    {
        $this->authorize('isAdmin', auth()->user());

        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }
}
