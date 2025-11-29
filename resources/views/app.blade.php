<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php
        $appUrl = config('app.url', url('/'));
        $metaTitle = 'LOGITELL | Tecnologia, computo y seguridad';
        $metaDescription = 'Compra laptops, PCs, smartphones y camaras en LOGITELL. Envio a todo Peru.';
        $metaImage = $appUrl.'/storage/images/ICONO%20%20256%20X%20256.png';
    @endphp
    <title>{{ $metaTitle }}</title>
    <link rel="canonical" href="{{ $appUrl }}">
    <link rel="icon" type="image/png" sizes="256x256" href="{{ $metaImage }}">
    <meta name="description" content="{{ $metaDescription }}">
    <meta property="og:title" content="{{ $metaTitle }}">
    <meta property="og:description" content="{{ $metaDescription }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $appUrl }}">
    <meta property="og:image" content="{{ $metaImage }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $metaTitle }}">
    <meta name="twitter:description" content="{{ $metaDescription }}">
    <meta name="twitter:image" content="{{ $metaImage }}">
    <script>
        window.__APP_CONFIG__ = {
            BACKEND_URL: "{{ rtrim(config('app.url', url('/')), '/') }}",
            API_URL: "{{ rtrim(config('app.url', url('/')), '/') }}/api"
        };
    </script>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    
    <!-- Vite Assets -->
     @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])

</head>
<body>
    <div id="root"></div>
</body>
</html>
