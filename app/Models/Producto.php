<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'subcategoria_id',
        'nombre',
        'slug',
        'descripcion',
        'especificaciones',
        'precio',
        'precio_oferta',
        'stock',
        'imagen_principal',
        'imagenes_adicionales',
        'activo',
        'destacado',
        'promocion', // Ensure this is here
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'precio_oferta' => 'decimal:2',
        'imagenes_adicionales' => 'array',
        'especificaciones' => 'array',
        'activo' => 'boolean',
        'destacado' => 'boolean',
        'promocion' => 'boolean', // Added casting for promocion
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function subcategoria(): BelongsTo
    {
        return $this->belongsTo(Subcategoria::class);
    }
}
