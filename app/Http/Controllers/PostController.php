<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(Post::where('activo', true)->orderBy('created_at', 'desc')->paginate(10));
    }

    public function store(Request $request)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'slug' => 'required|string|unique:posts',
            'contenido' => 'required|string',
            'extracto' => 'required|string|max:500',
            'imagen' => 'nullable|image|max:2048',
            'autor' => 'required|string',
            'activo' => 'boolean',
        ]);

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function show(Post $post)
    {
        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('isAdmin', auth()->user());

        $validated = $request->validate([
            'titulo' => 'string|max:255',
            'slug' => 'string|unique:posts,slug,' . $post->id,
            'contenido' => 'string',
            'extracto' => 'string|max:500',
            'imagen' => 'nullable|image|max:2048',
            'autor' => 'string',
            'activo' => 'boolean',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('isAdmin', auth()->user());

        $post->delete();

        return response()->json(['message' => 'Post eliminado']);
    }
}
