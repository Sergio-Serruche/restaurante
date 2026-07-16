# Restaurate - Frontend Web

Este es el cliente web de la plataforma **Restaurate**, construido sobre **React**, **Vite** y diseñado con estilos premium personalizados en **Vanilla CSS**.

## Estructura del Frontend
```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables (Navbar, ProtectedRoute)
│   ├── pages/            # Vistas de la aplicación (Home, Login, Menú, Carrito, etc.)
│   ├── App.jsx           # Enrutamiento y estado global del carrito
│   ├── index.css         # Hoja de estilos global con diseño premium
│   └── main.jsx          # Punto de entrada de la aplicación
├── index.html            # Contenedor HTML principal
├── package.json          # Dependencias y scripts del frontend
└── vite.config.js        # Configuración de Vite (puerto 3000)
```

## Configuración y Arranque

1. Instala las dependencias:
   ```bash
   pnpm install
   ```
2. Inicia el servidor de desarrollo local de Vite:
   ```bash
   pnpm dev
   ```
   La aplicación se abrirá automáticamente en tu navegador predeterminado en `http://localhost:3000`.
