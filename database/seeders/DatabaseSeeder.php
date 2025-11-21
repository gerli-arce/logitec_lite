<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Categoria;
use App\Models\Subcategoria;
use App\Models\Producto;
use App\Models\Post;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario Admin
        User::create([
            'name' => 'Admin LOGITEC',
            'email' => 'admin@logitec.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Usuario normal
        User::create([
            'name' => 'Cliente LOGITEC',
            'email' => 'cliente@logitec.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        // Categorías
        $computadoras = Categoria::create([
            'nombre' => 'Computadoras',
            'slug' => 'computadoras',
            'descripcion' => 'Laptops y PCs de alto rendimiento',
            'activo' => true,
        ]);

        $telefonos = Categoria::create([
            'nombre' => 'Teléfonos',
            'slug' => 'telefonos',
            'descripcion' => 'Smartphones y dispositivos móviles',
            'activo' => true,
        ]);

        $camaras = Categoria::create([
            'nombre' => 'Cámaras de Seguridad',
            'slug' => 'camaras-seguridad',
            'descripcion' => 'Sistemas de vigilancia profesionales',
            'activo' => true,
        ]);

        // NUEVAS CATEGORÍAS
        $accesorios = Categoria::create([
            'nombre' => 'Accesorios de Computo',
            'slug' => 'accesorios-computo',
            'descripcion' => 'Accesorios para computadoras, teclados, mouse, audífonos',
            'activo' => true,
        ]);

        $redes = Categoria::create([
            'nombre' => 'Redes y Conectividad',
            'slug' => 'redes-conectividad',
            'descripcion' => 'Equipos de red como routers, switches y repetidores',
            'activo' => true,
        ]);

        // Subcategorías
        $sub1 = Subcategoria::create([
            'categoria_id' => $computadoras->id,
            'nombre' => 'Laptops Gaming',
            'slug' => 'laptops-gaming',
            'descripcion' => 'Laptops para gaming de alta performance',
            'activo' => true,
        ]);

        $sub2 = Subcategoria::create([
            'categoria_id' => $computadoras->id,
            'nombre' => 'PCs de Escritorio',
            'slug' => 'pcs-escritorio',
            'descripcion' => 'Computadoras de escritorio profesionales',
            'activo' => true,
        ]);

        $sub3 = Subcategoria::create([
            'categoria_id' => $telefonos->id,
            'nombre' => 'Smartphones',
            'slug' => 'smartphones',
            'descripcion' => 'Teléfonos inteligentes Android e iOS',
            'activo' => true,
        ]);

        $sub4 = Subcategoria::create([
            'categoria_id' => $camaras->id,
            'nombre' => 'Cámaras IP',
            'slug' => 'camaras-ip',
            'descripcion' => 'Cámaras IP para vigilancia remota',
            'activo' => true,
        ]);

        // SUBCATEGORÍAS NUEVAS
        $sub5 = Subcategoria::create([
            'categoria_id' => $accesorios->id,
            'nombre' => 'Teclados',
            'slug' => 'teclados',
            'descripcion' => 'Teclados mecánicos y de membrana',
            'activo' => true,
        ]);

        $sub6 = Subcategoria::create([
            'categoria_id' => $accesorios->id,
            'nombre' => 'Audífonos',
            'slug' => 'audifonos',
            'descripcion' => 'Audífonos inalámbricos y alámbricos',
            'activo' => true,
        ]);

        $sub7 = Subcategoria::create([
            'categoria_id' => $redes->id,
            'nombre' => 'Routers',
            'slug' => 'routers',
            'descripcion' => 'Routers WiFi de alta velocidad',
            'activo' => true,
        ]);

        $sub8 = Subcategoria::create([
            'categoria_id' => $redes->id,
            'nombre' => 'Switches',
            'slug' => 'switches',
            'descripcion' => 'Switches administrables y no administrables',
            'activo' => true,
        ]);

        // Productos originales
        Producto::create([
            'categoria_id' => $computadoras->id,
            'subcategoria_id' => $sub1->id,
            'nombre' => 'Laptop ASUS ROG Gaming RTX 4090',
            'slug' => 'laptop-asus-rog-rtx4090',
            'descripcion' => 'Laptop de gaming profesional con RTX 4090, i9-13900HX, 32GB RAM, 1TB SSD',
            'precio' => 3500.00,
            'precio_oferta' => 2999.00,
            'stock' => 5,
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => $computadoras->id,
            'subcategoria_id' => $sub2->id,
            'nombre' => 'PC Gamer High-End Ryzen 9',
            'slug' => 'pc-gamer-ryzen9',
            'descripcion' => 'PC gamer de alta performance con Ryzen 9 7950X, RTX 4080',
            'precio' => 2800.00,
            'stock' => 3,
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => $telefonos->id,
            'subcategoria_id' => $sub3->id,
            'nombre' => 'iPhone 15 Pro Max 256GB',
            'slug' => 'iphone-15-pro-max',
            'descripcion' => 'Último modelo iPhone con chip A17 Pro, pantalla Retina XDR',
            'precio' => 1199.00,
            'stock' => 10,
            'activo' => true,
            'destacado' => true,
        ]);

        Producto::create([
            'categoria_id' => $camaras->id,
            'subcategoria_id' => $sub4->id,
            'nombre' => 'Cámara IP 4K POE',
            'slug' => 'camara-ip-4k-poe',
            'descripcion' => 'Cámara IP 4K con POE, visión nocturna, detección de movimiento',
            'precio' => 499.00,
            'stock' => 15,
            'activo' => true,
            'destacado' => false,
        ]);

        // Posts Blog
        Post::create([
            'titulo' => 'Top 5 Laptops Gaming 2024',
            'slug' => 'top-5-laptops-gaming-2024',
            'contenido' => 'En este artículo te presentamos las mejores laptops gaming disponibles en 2024...',
            'extracto' => 'Descubre las mejores opciones de laptops gaming para jugar en máxima calidad',
            'autor' => 'Admin LOGITEC',
            'activo' => true,
        ]);

        Post::create([
            'titulo' => 'Guía de Seguridad: Cámaras IP para el hogar',
            'slug' => 'guia-camaras-ip-hogar',
            'contenido' => 'Todo lo que necesitas saber sobre cámaras IP para proteger tu hogar...',
            'extracto' => 'Aprende cómo elegir e instalar cámaras de seguridad IP',
            'autor' => 'Admin LOGITEC',
            'activo' => true,
        ]);

         // Settings
        Setting::create([
            'clave' => 'whatsapp_number', // Changed from whatsapp_phone to whatsapp_number to match frontend
            'valor' => '+51940781831', // Updated to Peru number
        ]);

        // Settings
        Setting::create([
            'clave' => 'whatsapp_phone',
            'valor' => '+34612345678',
        ]);

        Setting::create([
            'clave' => 'whatsapp_message',
            'valor' => 'Hola, me gustaría información sobre tus productos',
        ]);

        Setting::create([
            'clave' => 'store_name',
            'valor' => 'LOGITEC',
        ]);

        Setting::create([
            'clave' => 'store_email',
            'valor' => 'info@logitec.com',
        ]);

        // ============================================================
        // 30 PRODUCTOS NUEVOS PARA PRUEBAS
        // ============================================================

        // Productos Computadoras
        Producto::insert([
            [
                'categoria_id' => $computadoras->id,
                'subcategoria_id' => $sub1->id,
                'nombre' => 'Laptop MSI Raider RTX 4080',
                'slug' => 'laptop-msi-raider-4080',
                'descripcion' => 'Laptop gamer con i9, RTX 4080, 32GB RAM',
                'precio' => 3200,
                'stock' => 4,
                'activo' => true,
                'destacado' => true
            ],
            [
                'categoria_id' => $computadoras->id,
                'subcategoria_id' => $sub1->id,
                'nombre' => 'Laptop Acer Predator Helios',
                'slug' => 'laptop-predator-helios',
                'descripcion' => 'Laptop gaming con RTX 4070 y 16GB RAM',
                'precio' => 2100,
                'stock' => 6,
                'activo' => true,
                'destacado' => false
            ],
            [
                'categoria_id' => $computadoras->id,
                'subcategoria_id' => $sub2->id,
                'nombre' => 'PC Workstation Intel Xeon',
                'slug' => 'pc-workstation-xeon',
                'descripcion' => 'Workstation profesional con Xeon y 64GB RAM',
                'precio' => 3500,
                'stock' => 2,
                'activo' => true,
                'destacado' => false
            ],
            [
                'categoria_id' => $computadoras->id,
                'subcategoria_id' => $sub2->id,
                'nombre' => 'PC Oficina Core i5 12th Gen',
                'slug' => 'pc-oficina-i5',
                'descripcion' => 'PC para oficina con Core i5 y SSD 512GB',
                'precio' => 750,
                'stock' => 12,
                'activo' => true,
                'destacado' => false
            ],
            [
                'categoria_id' => $computadoras->id,
                'subcategoria_id' => $sub1->id,
                'nombre' => 'Laptop HP Pavilion 15',
                'slug' => 'laptop-hp-pavilion-15',
                'descripcion' => 'Laptop para trabajo y estudio con Ryzen 7',
                'precio' => 950,
                'stock' => 8,
                'activo' => true,
                'destacado' => false
            ],
        ]);

        // Productos Teléfonos
        Producto::insert([
            [
                'categoria_id' => $telefonos->id,
                'subcategoria_id' => $sub3->id,
                'nombre' => 'Samsung S24 Ultra 512GB',
                'slug' => 'samsung-s24-ultra',
                'descripcion' => 'Smartphone premium con cámara 200MP',
                'precio' => 1399,
                'stock' => 9,
                'activo' => true,
                'destacado' => true
            ],
            [
                'categoria_id' => $telefonos->id,
                'subcategoria_id' => $sub3->id,
                'nombre' => 'Google Pixel 8 Pro',
                'slug' => 'pixel-8-pro',
                'descripcion' => 'Teléfono con Android puro y cámara profesional',
                'precio' => 1099,
                'stock' => 5,
                'activo' => true,
                'destacado' => false
            ],
            [
                'categoria_id' => $telefonos->id,
                'subcategoria_id' => $sub3->id,
                'nombre' => 'Xiaomi 14 Pro',
                'slug' => 'xiaomi-14-pro',
                'descripcion' => 'Smartphone gama alta con Snapdragon 8 Gen 3',
                'precio' => 899,
                'stock' => 15,
                'activo' => true,
                'destacado' => true
            ],
            [
                'categoria_id' => $telefonos->id,
                'subcategoria_id' => $sub3->id,
                'nombre' => 'Motorola Edge 40',
                'slug' => 'motorola-edge-40',
                'descripcion' => 'Smartphone elegante con cámara de 50MP',
                'precio' => 599,
                'stock' => 14,
                'activo' => true,
                'destacado' => false
            ],
            [
                'categoria_id' => $telefonos->id,
                'subcategoria_id' => $sub3->id,
                'nombre' => 'Realme GT 6',
                'slug' => 'realme-gt-6',
                'descripcion' => 'Smartphone potente con gran rendimiento',
                'precio' => 699,
                'stock' => 11,
                'activo' => true,
                'destacado' => false
            ],
        ]);

        // Productos Cámaras
        Producto::insert([
            [
                'categoria_id' => $camaras->id,
                'subcategoria_id' => $sub4->id,
                'nombre' => 'Cámara IP Dahua 4MP',
                'slug' => 'camara-dahua-4mp',
                'descripcion' => 'Cámara profesional Dahua con visión nocturna',
                'precio' => 180,
                'stock' => 20,
                'activo' => true
            ],
            [
                'categoria_id' => $camaras->id,
                'subcategoria_id' => $sub4->id,
                'nombre' => 'Cámara Hikvision TurboHD',
                'slug' => 'camara-hikvision-turbohd',
                'descripcion' => 'Cámara TurboHD 1080p para vigilancia',
                'precio' => 120,
                'stock' => 25,
                'activo' => true
            ],
            [
                'categoria_id' => $camaras->id,
                'subcategoria_id' => $sub4->id,
                'nombre' => 'Kit 4 Cámaras 5MP',
                'slug' => 'kit-4-camaras-5mp',
                'descripcion' => 'Kit de 4 cámaras de seguridad 5MP',
                'precio' => 350,
                'stock' => 10,
                'activo' => true
            ],
            [
                'categoria_id' => $camaras->id,
                'subcategoria_id' => $sub4->id,
                'nombre' => 'Cámara WiFi 360° Indoor',
                'slug' => 'camara-wifi-360',
                'descripcion' => 'Cámara con rotación automática 360°',
                'precio' => 99,
                'stock' => 30,
                'activo' => true
            ],
            [
                'categoria_id' => $camaras->id,
                'subcategoria_id' => $sub4->id,
                'nombre' => 'Cámara Solar Exterior 1080p',
                'slug' => 'camara-solar-exterior',
                'descripcion' => 'Cámara IP con panel solar integrado',
                'precio' => 150,
                'stock' => 18,
                'activo' => true
            ],
        ]);

        // Productos Accesorios
        Producto::insert([
            [
                'categoria_id' => $accesorios->id,
                'subcategoria_id' => $sub5->id,
                'nombre' => 'Teclado Mecánico Redragon Kumara',
                'slug' => 'teclado-redragon-kumara',
                'descripcion' => 'Teclado mecánico RGB switches rojos',
                'precio' => 59,
                'stock' => 40,
                'activo' => true
            ],
            [
                'categoria_id' => $accesorios->id,
                'subcategoria_id' => $sub5->id,
                'nombre' => 'Teclado Logitech MK850',
                'slug' => 'teclado-logitech-mk850',
                'descripcion' => 'Teclado ergonómico inalámbrico',
                'precio' => 89,
                'stock' => 22,
                'activo' => true
            ],
            [
                'categoria_id' => $accesorios->id,
                'subcategoria_id' => $sub6->id,
                'nombre' => 'Audífonos Logitech G435',
                'slug' => 'audifonos-g435',
                'descripcion' => 'Audífonos inalámbricos con micrófono',
                'precio' => 79,
                'stock' => 30,
                'activo' => true
            ],
            [
                'categoria_id' => $accesorios->id,
                'subcategoria_id' => $sub6->id,
                'nombre' => 'Audífonos HyperX Cloud II',
                'slug' => 'audifonos-hyperx-cloud-2',
                'descripcion' => 'Headset gaming profesional',
                'precio' => 99,
                'stock' => 25,
                'activo' => true
            ],
            [
                'categoria_id' => $accesorios->id,
                'subcategoria_id' => $sub6->id,
                'nombre' => 'Audífonos Sony WH-CH720',
                'slug' => 'audifonos-sony-ch720',
                'descripcion' => 'Audífonos Bluetooth con cancelación de ruido',
                'precio' => 149,
                'stock' => 10,
                'activo' => true
            ],
        ]);

        // Productos Redes
        Producto::insert([
            [
                'categoria_id' => $redes->id,
                'subcategoria_id' => $sub7->id,
                'nombre' => 'Router TP-Link Archer AX10',
                'slug' => 'router-archer-ax10',
                'descripcion' => 'Router WiFi 6 dual band',
                'precio' => 89,
                'stock' => 20,
                'activo' => true
            ],
            [
                'categoria_id' => $redes->id,
                'subcategoria_id' => $sub7->id,
                'nombre' => 'Router Huawei AX3',
                'slug' => 'router-huawei-ax3',
                'descripcion' => 'Router WiFi 6 de alta velocidad',
                'precio' => 99,
                'stock' => 18,
                'activo' => true
            ],
            [
                'categoria_id' => $redes->id,
                'subcategoria_id' => $sub8->id,
                'nombre' => 'Switch 8 Puertos TP-Link',
                'slug' => 'switch-tplink-8p',
                'descripcion' => 'Switch de 8 puertos 10/100/1000 Mbps',
                'precio' => 39,
                'stock' => 35,
                'activo' => true
            ],
            [
                'categoria_id' => $redes->id,
                'subcategoria_id' => $sub8->id,
                'nombre' => 'Switch Cisco 16 Puertos',
                'slug' => 'switch-cisco-16p',
                'descripcion' => 'Switch Cisco serie empresarial',
                'precio' => 179,
                'stock' => 10,
                'activo' => true
            ],
            [
                'categoria_id' => $redes->id,
                'subcategoria_id' => $sub7->id,
                'nombre' => 'Repetidor WiFi Xiaomi Pro',
                'slug' => 'repetidor-xiaomi-pro',
                'descripcion' => 'Repetidor WiFi de amplio alcance',
                'precio' => 29,
                'stock' => 50,
                'activo' => true
            ],
        ]);

    }
}
