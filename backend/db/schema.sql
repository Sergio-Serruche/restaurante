-- Script de Creación de la Base de Datos para Restaurate
-- Motor de Base de Datos: PostgreSQL

-- Eliminar tablas si existen (para reinicio de base de datos)
DROP TABLE IF EXISTS calificaciones CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS detalles_pedidos CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS direcciones CASCADE;
DROP TABLE IF EXISTS repartidores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

-- 1. Tabla de Categorías de Menú
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Productos del Menú
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    imagen_url VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Usuarios (Clientes y Administradores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'cocinero', 'administrador')),
    puntos_fidelidad INT DEFAULT 0 CHECK (puntos_fidelidad >= 0),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Repartidores
CREATE TABLE repartidores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    vehiculo VARCHAR(50), -- ej. Moto, Bicicleta, Auto
    disponible BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Direcciones de Entrega
CREATE TABLE direcciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    direccion TEXT NOT NULL,
    referencia VARCHAR(255),
    ciudad VARCHAR(100) DEFAULT 'Ciudad de Origen',
    predeterminada BOOLEAN DEFAULT FALSE
);

-- 6. Tabla de Pedidos (Cabecera)
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    repartidor_id INT REFERENCES repartidores(id) ON DELETE SET NULL,
    tipo_pedido VARCHAR(50) NOT NULL CHECK (tipo_pedido IN ('local', 'pick-up', 'delivery')),
    estado VARCHAR(50) DEFAULT 'Creado' CHECK (estado IN ('Creado', 'Pagado', 'En Preparacion', 'Listo para Entrega', 'En Camino', 'Entregado', 'Cancelado')),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    puntos_ganados INT DEFAULT 0,
    direccion_id INT REFERENCES direcciones(id) ON DELETE SET NULL,
    mesa VARCHAR(20), -- Solo si tipo_pedido = 'local'
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabla de Detalles del Pedido
CREATE TABLE detalles_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id) ON DELETE SET NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 8. Tabla de Pagos
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto >= 0),
    metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('tarjeta', 'efectivo', 'billetera_digital')),
    estado_pago VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado_pago IN ('Pendiente', 'Aprobado', 'Rechazado')),
    transaccion_externa_id VARCHAR(255),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabla de Calificaciones
CREATE TABLE calificaciones (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    estrellas INT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos Semilla Básicos (Para pruebas iniciales)
INSERT INTO categorias (nombre, descripcion) VALUES
('Entradas', 'Deliciosos platos para comenzar tu comida'),
('Platos Fuertes', 'Nuestras mejores especialidades y platos de fondo'),
('Bebidas', 'Refrescos, jugos naturales y cervezas artesanales'),
('Postres', 'Dulces perfectos para cerrar con broche de oro');

INSERT INTO productos (categoria_id, nombre, descripcion, precio) VALUES
(1, 'Empanadas de Carne (3 unidades)', 'Crujientes empanadas rellenas de carne de res picada a cuchillo.', 6.50),
(1, 'Papas Nativas con Queso', 'Papas rústicas servidas con crema de queso andino artesanal.', 5.00),
(2, 'Lomo Saltado Clásico', 'Trozos de lomo de res salteados al wok con cebolla, tomate, ají amarillo y sillao. Acompañado de papas fritas y arroz.', 15.90),
(2, 'Hamburguesa Restaurate Pro', 'Doble carne de res, queso cheddar fundido, tocino crujiente, lechuga y salsa especial en pan brioche. Con papas fritas.', 12.50),
(3, 'Chicha Morada Orgánica (1 Litro)', 'Bebida tradicional peruana a base de maíz morado hervido con piña, manzana y especias.', 4.00),
(3, 'Limonada de Hierbabuena', 'Zumo de limón fresco licuado con hojas de hierbabuena y hielo.', 3.00),
(4, 'Tres Leches de Lúcuma', 'Bizcocho bañado en tres tipos de leche aromatizado con pulpa de lúcuma.', 5.50),
(4, 'Brownie con Helado de Vainilla', 'Brownie tibio de chocolate fudge servido con una bola de helado artesanal.', 4.50);
