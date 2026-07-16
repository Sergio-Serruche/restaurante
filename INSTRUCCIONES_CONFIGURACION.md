# Guía de Configuración e Inicio - Restaurate
*Ecosistema Digital de Pedidos en Línea y Gestión Gastronómica*

Esta guía contiene los pasos necesarios para configurar y arrancar la plataforma **Restaurate** de manera local en tu computadora. El proyecto está dividido en una arquitectura desacoplada: **Backend (Node.js/Express)** y **Frontend (React/Vite)**, utilizando **PostgreSQL** como base de datos relacional.

---

## 🛠️ Prerrequisitos

Antes de iniciar, asegúrate de tener instalado en tu sistema:
1. **Node.js** (Versión 18 o superior recomendada).
2. **PostgreSQL** (Servicio activo y corriendo localmente).
3. **Visual Studio Code** (como editor de código recomendado).

---

## 🗄️ Paso 1: Configuración de la Base de Datos (PostgreSQL)

1. Abre tu terminal de PostgreSQL (pgAdmin, psql, o el panel de comandos de tu preferencia).
2. Crea una nueva base de datos llamada `restaurate_db`:
   ```sql
   CREATE DATABASE restaurate_db;
   ```
3. Conéctate a la base de datos recién creada y ejecuta el script de definición de tablas provisto en [backend/db/schema.sql](file:///C:/Users/venta/Desktop/res/backend/db/schema.sql) para crear las tablas necesarias e insertar los platos semilla iniciales:
   * Puedes usar la herramienta Query Tool de pgAdmin, o ejecutar directamente por consola:
   ```bash
   psql -U postgres -d restaurate_db -f backend/db/schema.sql
   ```

---

## ⚙️ Paso 2: Configuración del Backend (API REST)

1. Abre la carpeta [backend](file:///C:/Users/venta/Desktop/res/backend) en tu terminal:
   ```bash
   cd backend
   ```
2. Instala las dependencias necesarias:
   ```bash
   pnpm install
   ```
3. Configura las variables de entorno:
   * Ya hemos creado un archivo [.env](file:///C:/Users/venta/Desktop/res/backend/.env) preconfigurado por ti.
   * Si tus credenciales de PostgreSQL (usuario y contraseña) difieren del estándar `postgres` y `admin`, abre el archivo [.env](file:///C:/Users/venta/Desktop/res/backend/.env) y modifícalo:
     ```env
     PORT=5000
     DB_USER=tu_usuario_postgres
     DB_PASSWORD=tu_contraseña_postgres
     DB_NAME=restaurate_db
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=tu_clave_secreta_jwt
     ```
4. Inicia el servidor de backend en modo desarrollo (con recarga automática mediante Nodemon):
   ```bash
   pnpm dev
   ```
   El backend se ejecutará en [http://localhost:5000](http://localhost:5000). Puedes probar la ruta raíz para validar el funcionamiento.

---

## 💻 Paso 3: Configuración del Frontend (React + Vite)

1. Abre una nueva pestaña de terminal y navega a la carpeta [frontend](file:///C:/Users/venta/Desktop/res/frontend):
   ```bash
   cd frontend
   ```
2. Instala las dependencias necesarias:
   ```bash
   pnpm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   pnpm dev
   ```
   El frontend se levantará en [http://localhost:3000](http://localhost:3000) y se abrirá automáticamente en tu navegador web.

---

## 📱 Guía de Uso Rápido y Flujo de Demostración

Una vez que tengas ambos servidores corriendo, sigue estos pasos para experimentar el flujo completo:

1. **Registro de Usuarios:**
   * Abre [http://localhost:3000](http://localhost:3000) y ve a la página de **Registrarse**.
   * Crea un usuario con rol de **Cliente** para realizar compras, y otro usuario con rol de **Administrador** o **Personal de Cocina** para gestionar la trastienda.
2. **Realizar un Pedido:**
   * Inicia sesión con la cuenta de Cliente.
   * Ve a la pestaña **Menú**, explora las categorías de platos y agrega productos al carrito usando los botones **Añadir +**.
   * Ve al **Carrito**, elige la modalidad del pedido (Consumo en mesa indicando número, o Delivery), selecciona tu método de pago y haz clic en **Realizar Pedido**.
   * Verás la confirmación inmediata y los puntos estrella acumulados por tu fidelidad.
3. **Control y Cocina:**
   * Cierra sesión e inicia con la cuenta de **Personal de Cocina** o **Administrador**.
   * Entra a la pestaña **Panel Gestión**.
   * Visualizarás el pedido que acabas de hacer en tiempo real. Podrás hacer clic en **Preparar** (cambiará el estado a *En Preparación*) y luego en **Listo** o **Entregado** para experimentar el flujo de operaciones del restaurante.
   * También puedes deshabilitar stock de platos haciendo clic en sus botones de disponibilidad en el menú de la derecha.
