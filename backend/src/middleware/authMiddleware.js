const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'No autorizado, token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurate_jwt_secret_token_key_12345');
      req.user = decoded;

      // Verificar rol si se especifican roles
      if (roles.length && !roles.includes(req.user.rol)) {
        return res.status(403).json({ mensaje: 'Acceso prohibido, no tienes permisos suficientes.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
  };
};
