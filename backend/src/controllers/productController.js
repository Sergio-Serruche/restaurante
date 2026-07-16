const db = require('../config/db');

exports.obtenerCategorias = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM categorias WHERE activo = true ORDER BY nombre ASC');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error al obtener categorías.' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      ORDER BY p.categoria_id, p.nombre ASC
    `;
    const resultado = await db.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos.' });
  }
};

exports.crearProducto = async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, imagen_url } = req.body;

  try {
    const resultado = await db.query(
      'INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [categoria_id, nombre, descripcion, precio, imagen_url]
    );
    res.status(201).json({ mensaje: 'Producto creado exitosamente.', producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto.' });
  }
};

exports.actualizarDisponibilidad = async (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;

  try {
    const resultado = await db.query(
      'UPDATE productos SET disponible = $1 WHERE id = $2 RETURNING *',
      [disponible, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: 'Estado del producto actualizado.', producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    res.status(500).json({ mensaje: 'Error al actualizar disponibilidad.' });
  }
};

exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { categoria_id, nombre, descripcion, precio, imagen_url } = req.body;

  try {
    const resultado = await db.query(
      'UPDATE productos SET categoria_id = $1, nombre = $2, descripcion = $3, precio = $4, imagen_url = $5 WHERE id = $6 RETURNING *',
      [categoria_id, nombre, descripcion, precio, imagen_url, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: 'Producto actualizado exitosamente.', producto: resultado.rows[0] });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto.' });
  }
};

exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto.' });
  }
};

exports.registrarIngreso = async (req, res) => {
  const { producto_id, cantidad, total, fecha } = req.body;

  try {
    let totalIngreso = total;
    if (!totalIngreso) {
      const prodRes = await db.query('SELECT precio FROM productos WHERE id = $1', [producto_id]);
      if (prodRes.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado.' });
      }
      totalIngreso = parseFloat(prodRes.rows[0].precio) * parseInt(cantidad);
    }

    const query = `
      INSERT INTO ingresos (producto_id, cantidad, total, fecha)
      VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP))
      RETURNING *
    `;
    const params = [producto_id, cantidad, totalIngreso, fecha || null];
    const resultado = await db.query(query, params);

    res.status(201).json({
      mensaje: 'Ingreso registrado exitosamente.',
      ingreso: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    res.status(500).json({ mensaje: 'Error al registrar ingreso.' });
  }
};

exports.obtenerIngresos = async (req, res) => {
  const { producto_id, fecha_inicio, fecha_fin } = req.query;

  try {
    let query = `
      SELECT i.*, p.nombre as producto_nombre, p.precio as producto_precio
      FROM ingresos i
      LEFT JOIN productos p ON i.producto_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (producto_id) {
      query += ` AND i.producto_id = $${paramIndex}`;
      params.push(producto_id);
      paramIndex++;
    }

    if (fecha_inicio) {
      query += ` AND i.fecha >= $${paramIndex}`;
      params.push(fecha_inicio);
      paramIndex++;
    }

    if (fecha_fin) {
      let fin = fecha_fin;
      if (fecha_fin.length === 10) {
        fin = `${fecha_fin} 23:59:59`;
      }
      query += ` AND i.fecha <= $${paramIndex}`;
      params.push(fin);
      paramIndex++;
    }

    query += ' ORDER BY i.fecha DESC';

    const resultado = await db.query(query, params);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener ingresos:', error);
    res.status(500).json({ mensaje: 'Error al obtener ingresos.' });
  }
};
