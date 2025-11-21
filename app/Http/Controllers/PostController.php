<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
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

            $filename = 'posts/' . Str::random(40) . '.' . $type;
            Storage::disk('public')->put($filename, $data);

            return '/storage/' . $filename;
        }
        return null;
    }

    public function index()
    {
        return response()->json(Post::where('activo', true)->orderBy('created_at', 'desc')->paginate(10));
    }

    public function indexAdmin(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Post::query();

        if ($request->filled('search')) {
            $query->where('titulo', 'like', '%' . $request->search . '%');
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts',
            'contenido' => 'required|string',
            'extracto' => 'required|string|max:500',
            'imagen' => 'nullable', // Allow string for Base64
            'autor' => 'required|string',
            'activo' => 'boolean',
        ]);

        if (!empty($validated['imagen']) && str_starts_with($validated['imagen'], 'data:image')) {
            $validated['imagen'] = $this->saveBase64Image($validated['imagen']);
        }

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function show(Post $post)
    {
        return response()->json($post);
    }

    public function showBySlug($slug)
    {
        $post = Post::where('slug', $slug)->where('activo', true)->firstOrFail();
        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'titulo' => 'string|max:255',
            'slug' => 'string|unique:posts,slug,' . $post->id,
            'contenido' => 'string',
            'extracto' => 'string|max:500',
            'imagen' => 'nullable', // Allow string for Base64
            'autor' => 'string',
            'activo' => 'boolean',
        ]);

        if (!empty($validated['imagen']) && str_starts_with($validated['imagen'], 'data:image')) {
            // Delete old image if exists
            if ($post->imagen) {
                $oldPath = str_replace('/storage/', '', $post->imagen);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['imagen'] = $this->saveBase64Image($validated['imagen']);
        } else {
            unset($validated['imagen']);
        }

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($post->imagen) {
            $oldPath = str_replace('/storage/', '', $post->imagen);
            Storage::disk('public')->delete($oldPath);
        }

        $post->delete();

        return response()->json(['message' => 'Post eliminado']);
    }
}
