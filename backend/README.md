# Restaurate - Backend API

Esta es la API RESTful de la plataforma de pedidos y gestión gastronómica **Restaurate**, construida utilizando **Node.js**, **Express.js** y **PostgreSQL**.

## Estructura del Backend
```
backend/
├── db/
│   └── schema.sql        # Definición de tablas y datos semilla de PostgreSQL
├── src/
│   ├── config/
│   │   └── db.js         # Configuración del pool de conexión a la BD
│   ├── controllers/      # Controladores de lógica de negocio (auth, pedidos, productos)
│   ├── middleware/       # Middlewares de Express (ej. validación de JWT y roles)
│   ├── routes/           # Rutas expuestas de la API
│   └── app.js            # Punto de entrada de la aplicación Express
├── .env                  # Configuración de variables de entorno (BD, JWT, Puerto)
├── .env.example          # Plantilla para variables de entorno
└── package.json          # Dependencias y scripts de ejecución
```

## Configuración y Arranque

1. Asegúrate de tener **PostgreSQL** instalado y corriendo en tu máquina local.
2. Crea una base de datos llamada `restaurate_db` y ejecuta el script en `db/schema.sql`:
   ```bash
   psql -U postgres -d restaurate_db -f db/schema.sql
   ```
3. Instala las dependencias:
   ```bash
   pnpm install
   ```
4. Configura el archivo `.env` con tus credenciales de PostgreSQL.
5. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   La API estará accesible en `http://localhost:5000`.
