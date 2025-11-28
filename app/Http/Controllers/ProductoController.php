<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Import Storage facade
use Illuminate\Support\Str; // Import Str facade

class ProductoController extends Controller
{
    private function saveBase64Image($base64Image)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $data = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }

            $data = base64_decode($data);

            if ($data === false) {
                throw new \Exception('base64_decode failed');
            }

            $filename = 'productos/' . Str::random(40) . '.' . $type;
            Storage::disk('public')->put($filename, $data);

            return '/storage/' . $filename;
        }
        return null;
    }

    public function index(Request $request)
    {
        $query = Producto::query();

        $query->where('activo', true);

        if ($request->filled('categoria_id')) {
            $categoryIds = explode(',', $request->categoria_id);
            $query->whereIn('categoria_id', $categoryIds);
        }

        if ($request->filled('subcategoria_id')) {
            $subcategoryIds = explode(',', $request->subcategoria_id);
            $query->whereIn('subcategoria_id', $subcategoryIds);
        }

        if ($request->filled('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('destacado')) {
            $query->where('destacado', true);
        }

        if ($request->filled('promocion')) {
            $query->where('promocion', true);
        }

        if ($request->filled('oferta')) {
            $query->whereNotNull('precio_oferta')->where('precio_oferta', '>', 0);
        }

        $perPage = $request->input('limit', 15);

        return response()->json($query->paginate($perPage));
    }

    public function indexAdmin(Request $request)
    {
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. User is not admin.',
                'user_id' => auth()->id(),
                'is_admin_check' => auth()->check() ? auth()->user()->isAdmin() : false
            ], 403);
        }

        $query = Producto::query();

        if ($request->filled('categoria_id')) {
            $categoryIds = explode(',', $request->categoria_id);
            $query->whereIn('categoria_id', $categoryIds);
        }

        if ($request->filled('subcategoria_id')) {
            $subcategoryIds = explode(',', $request->subcategoria_id);
            $query->whereIn('subcategoria_id', $subcategoryIds);
        }

        if ($request->filled('search')) {
            $query->where('nombre', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('promocion')) {
            $query->where('promocion', true);
        }

        return response()->json($query->paginate(15));
    }

    public function destacados()
    {
        return response()->json(Producto::where('activo', true)->where('destacado', true)->limit(6)->get());
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin');

        $validated = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'subcategoria_id' => 'required|exists:subcategorias,id',
            'nombre' => 'required|string|max:255',
            'slug' => 'required|string|unique:productos',
            'descripcion' => 'required|string',
            'marca' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|array',
            'precio' => 'required|numeric|min:0',
            'precio_oferta' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'imagen_principal' => 'nullable', // Allow string for Base64
            'activo' => 'boolean',
            'destacado' => 'boolean',
            'promocion' => 'boolean', // Added validation for promocion
        ]);

        if (!empty($validated['imagen_principal']) && str_starts_with($validated['imagen_principal'], 'data:image')) {
            $validated['imagen_principal'] = $this->saveBase64Image($validated['imagen_principal']);
        } elseif ($request->hasFile('imagen_principal')) {
            $path = $request->file('imagen_principal')->store('productos', 'public');
            $validated['imagen_principal'] = '/storage/' . $path;
        }

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
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized action.', 'debug_user' => auth()->user()], 403);
        }
        
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'slug' => 'string|unique:productos,slug,' . $producto->id,
            'descripcion' => 'string',
            'marca' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|array',
            'precio' => 'numeric|min:0',
            'precio_oferta' => 'nullable|numeric|min:0',
            'stock' => 'integer|min:0',
            'imagen_principal' => 'nullable', // Allow string for Base64
            'activo' => 'boolean',
            'destacado' => 'boolean',
            'promocion' => 'boolean', // Added validation for promocion
        ]);

        if (!empty($validated['imagen_principal']) && str_starts_with($validated['imagen_principal'], 'data:image')) {
            // Delete old image if exists
            if ($producto->imagen_principal) {
                $oldPath = str_replace('/storage/', '', $producto->imagen_principal);
                Storage::disk('public')->delete($oldPath);
            }
            
            $validated['imagen_principal'] = $this->saveBase64Image($validated['imagen_principal']);
        } elseif ($request->hasFile('imagen_principal')) {
            // Delete old image if exists
            if ($producto->imagen_principal) {
                $oldPath = str_replace('/storage/', '', $producto->imagen_principal);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('imagen_principal')->store('productos', 'public');
            $validated['imagen_principal'] = '/storage/' . $path;
        } else {
            unset($validated['imagen_principal']);
        }

        $producto->update($validated);

        return response()->json($producto);
    }

    public function destroy($id)
    {
        $this->authorize('isAdmin');

        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }
}
