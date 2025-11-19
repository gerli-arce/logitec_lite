export const metadata = {
  title: 'LOGITEC E-Commerce - Laravel + React',
  description: 'Proyecto híbrido Laravel 11 + React 18 + Vite',
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}


import './globals.css'