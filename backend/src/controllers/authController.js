const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Validar si el usuario ya existe
    const usuarioExistente = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Asignar rol (por defecto 'cliente', a menos que se cree un administrador explícito)
    const nuevoRol = rol && ['cliente', 'cocinero', 'administrador'].includes(rol) ? rol : 'cliente';

    // Insertar en la BD
    const resultado = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, puntos_fidelidad',
      [nombre, email, passwordHash, nuevoRol]
    );

    const usuario = resultado.rows[0];

    // Crear Token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'restaurate_jwt_secret_token_key_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito.',
      token,
      usuario
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const usuario = resultado.rows[0];

    // Verificar contraseña
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Crear Token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'restaurate_jwt_secret_token_key_12345',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puntos_fidelidad: usuario.puntos_fidelidad
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

exports.obtenerPerfil = async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT id, nombre, email, rol, puntos_fidelidad, fecha_registro FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};
