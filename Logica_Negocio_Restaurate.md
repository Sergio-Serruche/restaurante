# Lógica de Negocio - Restaurate
*Reglas de Negocio, Actores y Modelo de Dominio de la Plataforma*

---

## 1. Propósito del Negocio

El propósito principal de **Restaurate** es proporcionar un ecosistema digital integrado que optimice la interacción entre el restaurante y sus clientes. La plataforma facilita la consulta interactiva del menú, la autogestión de pedidos, el procesamiento seguro de pagos, el seguimiento en tiempo real y la entrega eficiente de alimentos. A nivel administrativo, busca centralizar la toma de decisiones, automatizar la asignación de tareas a cocina y reparto, y proveer métricas clave para la optimización del negocio.

---

## 2. Actores del Sistema

El sistema identifica cinco roles o actores principales, cada uno con responsabilidades y permisos específicos:

| Actor | Descripción | Permisos Clave |
| :--- | :--- | :--- |
| **Cliente Invitado** | Usuario no registrado que accede al menú a través de la web o escaneando un código QR. | <ul><li>Visualizar el menú y precios.</li><li>Agregar productos al carrito.</li><li>Iniciar registro para completar pedido.</li></ul> |
| **Cliente Registrado** | Usuario autenticado en la plataforma. | <ul><li>Realizar pedidos (local, pick-up o delivery).</li><li>Guardar direcciones de entrega y métodos de pago.</li><li>Consultar historial de pedidos.</li><li>Calificar el servicio y acumular puntos de fidelidad.</li></ul> |
| **Cocinero / Personal de Cocina** | Usuario responsable de la preparación de los alimentos en el local. | <ul><li>Visualizar pedidos entrantes en la pantalla de cocina (KDS).</li><li>Actualizar el estado del pedido (En preparación, Listo para entrega).</li><li>Reportar falta de stock temporal de un ingrediente/producto.</li></ul> |
| **Repartidor** | Usuario encargado de la entrega física del pedido (solo modalidad delivery). | <ul><li>Aceptar/Rechazar solicitudes de reparto.</li><li>Visualizar la ruta de entrega mediante GPS.</li><li>Actualizar el estado del reparto (En camino, Entregado, Incidencia).</li></ul> |
| **Administrador** | Propietario o gerente del restaurante con control total de la plataforma. | <ul><li>Gestionar el menú (crear, editar, eliminar productos y categorías).</li><li>Gestionar usuarios, roles y repartidores.</li><li>Configurar precios de suscripción y reglas de negocio.</li><li>Acceder al panel de reportes financieros y analíticos.</li></ul> |

---

## 3. Reglas de Negocio Generales

Las siguientes reglas (RN) rigen el comportamiento operativo de **Restaurate**:

* **RN-01 (Autenticación requerida para pedidos):** Todo cliente debe estar registrado e iniciar sesión para confirmar y finalizar un pedido. Los usuarios invitados pueden armar un carrito pero deberán registrarse para proceder al checkout.
* **RN-02 (Validación de Stock):** El sistema debe verificar la disponibilidad de los ingredientes y productos en tiempo real antes de permitir que se agreguen al carrito o se confirme la compra. Si un producto se agota en cocina, se deshabilitará automáticamente del menú digital.
* **RN-03 (Aprobación de Pago):** Para los pedidos con método de pago en línea (tarjeta de crédito/débito, billetera digital), la orden solo se enviará a la pantalla de la cocina una vez que la pasarela de pagos devuelva un estado de transacción **aprobada**.
* **RN-04 (Ciclo de Vida del Pedido):** El pedido debe transicionar obligatoriamente por los siguientes estados en orden secuencial:
  
  ```
  [Creado] ➔ [Pagado] ➔ [En Preparación] ➔ [Listo para Entrega] ➔ [En Camino (solo delivery)] ➔ [Entregado]
  ```
  *(Nota: Si el pago falla o el cliente cancela antes de la preparación, pasa a **[Cancelado]**)*.
* **RN-05 (Límite de Pedidos Activos por Repartidor):** Para garantizar la rapidez y calidad de entrega, un repartidor no puede tener más de **2 pedidos activos** en ruta simultáneamente.
* **RN-06 (Calificación del Servicio):** El cliente solo podrá calificar un pedido (escala de 1 a 5 estrellas y comentarios) dentro de las **48 horas posteriores** a la confirmación de la entrega.

---

## 4. Entidades Principales (Modelo de Datos)

El dominio de **Restaurate** está representado por las siguientes entidades principales en la base de datos relacional:

* **Cliente:** Almacena información de contacto, credenciales, saldo de puntos de fidelidad y preferencias.
* **Administrador:** Datos del personal de gestión y configuración de accesos.
* **Repartidor:** Datos del conductor, estado de disponibilidad (libre/ocupado) y vehículo.
* **Producto:** Nombre, descripción, precio, imagen, disponibilidad de stock e ingredientes del menú.
* **Categoría:** Agrupador de productos (ej. Entradas, Platos Fuertes, Bebidas, Postres).
* **Pedido:** Cabecera de la transacción. Registra la fecha, tipo de pedido (mesa, pick-up, delivery), estado actual, total e impuestos.
* **DetallePedido:** Detalle de los productos incluidos en un pedido específico, cantidad y subtotal.
* **Pago:** Registro de la transacción financiera (monto, método de pago, ID de transacción externa y estado).
* **Dirección:** Ubicaciones guardadas por los clientes para envíos de delivery.
* **Calificación:** Evaluaciones numéricas y reseñas escritas dejadas por los clientes sobre un pedido.
