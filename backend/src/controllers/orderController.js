const db = require('../config/db');

exports.crearPedido = async (req, res) => {
  const { tipo_pedido, productos, mesa, direccion_id, metodo_pago } = req.body;
  const usuario_id = req.user.id;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ mensaje: 'El pedido debe contener al menos un producto.' });
  }

  const client = await db.pool.connect();

  try {
    // Iniciar Transacción
    await client.query('BEGIN');

    let total = 0;
    const detallesParaInsertar = [];

    // Validar productos y calcular total
    for (const item of productos) {
      const prodRes = await client.query('SELECT * FROM productos WHERE id = $1', [item.producto_id]);
      if (prodRes.rows.length === 0) {
        throw new Error(`El producto con ID ${item.producto_id} no existe.`);
      }

      const producto = prodRes.rows[0];
      if (!producto.disponible) {
        throw new Error(`El producto "${producto.nombre}" no está disponible en este momento.`);
      }

      const cantidad = parseInt(item.cantidad);
      const precio_unitario = parseFloat(producto.precio);
      const subtotal = precio_unitario * cantidad;

      total += subtotal;

      detallesParaInsertar.push({
        producto_id: producto.id,
        cantidad,
        precio_unitario,
        subtotal
      });
    }

    // Calcular puntos de fidelidad ganados (ej. 1 punto por cada $10 gastados)
    const puntos_ganados = Math.floor(total / 10);

    // Crear cabecera del pedido
    const pedidoQuery = `
      INSERT INTO pedidos (usuario_id, tipo_pedido, total, puntos_ganados, direccion_id, mesa, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const estadoInicial = metodo_pago === 'efectivo' ? 'Creado' : 'Pagado'; // Para fines de simulación, si paga en línea con tarjeta pasa a 'Pagado'
    const pedidoRes = await client.query(pedidoQuery, [
      usuario_id,
      tipo_pedido,
      total,
      puntos_ganados,
      tipo_pedido === 'delivery' ? direccion_id : null,
      tipo_pedido === 'local' ? mesa : null,
      estadoInicial
    ]);

    const nuevoPedido = pedidoRes.rows[0];

    // Crear los detalles del pedido
    const detalleQuery = `
      INSERT INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const det of detallesParaInsertar) {
      await client.query(detalleQuery, [
        nuevoPedido.id,
        det.producto_id,
        det.cantidad,
        det.precio_unitario,
        det.subtotal
      ]);
    }

    // Insertar registro de pago correspondiente
    const pagoQuery = `
      INSERT INTO pagos (pedido_id, monto, metodo_pago, estado_pago, transaccion_externa_id)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const estadoPago = estadoInicial === 'Pagado' ? 'Aprobado' : 'Pendiente';
    const txId = estadoInicial === 'Pagado' ? `TX-${Date.now()}` : null;
    await client.query(pagoQuery, [
      nuevoPedido.id,
      total,
      metodo_pago,
      estadoPago,
      txId
    ]);

    // Sumar puntos de fidelidad al usuario
    await client.query(
      'UPDATE usuarios SET puntos_fidelidad = puntos_fidelidad + $1 WHERE id = $2',
      [puntos_ganados, usuario_id]
    );

    // Confirmar Transacción
    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente.',
      pedido: nuevoPedido,
      detalles: detallesParaInsertar
    });
  } catch (error) {
    // Revertir Transacción en caso de error
    await client.query('ROLLBACK');
    console.error('Error al procesar pedido:', error.message);
    res.status(400).json({ mensaje: error.message || 'Error al procesar el pedido.' });
  } finally {
    client.release();
  }
};

exports.obtenerMisPedidos = async (req, res) => {
  try {
    const query = `
      SELECT p.*, 
        (SELECT json_agg(json_build_object('nombre', pr.nombre, 'cantidad', dp.cantidad, 'precio', dp.precio_unitario))
         FROM detalles_pedidos dp
         JOIN productos pr ON dp.producto_id = pr.id
         WHERE dp.pedido_id = p.id) as productos
      FROM pedidos p
      WHERE p.usuario_id = $1
      ORDER BY p.fecha_pedido DESC
    `;
    const resultado = await db.query(query, [req.user.id]);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener mis pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener tus pedidos.' });
  }
};

exports.obtenerTodosLosPedidos = async (req, res) => {
  try {
    const query = `
      SELECT p.*, u.nombre as cliente_nombre, u.email as cliente_email,
        (SELECT json_agg(json_build_object('nombre', pr.nombre, 'cantidad', dp.cantidad, 'precio', dp.precio_unitario))
         FROM detalles_pedidos dp
         JOIN productos pr ON dp.producto_id = pr.id
         WHERE dp.pedido_id = p.id) as productos
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_pedido DESC
    `;
    const resultado = await db.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener todos los pedidos.' });
  }
};

exports.actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['Creado', 'Pagado', 'En Preparacion', 'Listo para Entrega', 'En Camino', 'Entregado', 'Cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado de pedido no válido.' });
  }

  try {
    const resultado = await db.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }

    res.json({ mensaje: 'Estado del pedido actualizado.', pedido: resultado.rows[0] });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado.' });
  }
};
