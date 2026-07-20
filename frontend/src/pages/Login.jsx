import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al iniciar sesión.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      // Si el rol es cocina o admin, ir al panel de gestión
      if (data.usuario.rol === 'administrador' || data.usuario.rol === 'cocinero' || data.usuario.rol === 'repartidor') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer} className="animate-fade-in">
      <div style={styles.formCard} className="glass">
        <h2 style={styles.title}>¡Hola de nuevo!</h2>
        <p style={styles.subtitle}>Inicia sesión para pedir tus platos favoritos en Restaurate</p>
        
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Iniciando Sesión...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿No tienes una cuenta? <Link to="/registro" style={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 30px',
    borderRadius: '18px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#FF6B35',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#78716C',
    textAlign: 'center',
    marginBottom: '24px',
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid #FCA5A5',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.9rem',
    color: '#78716C',
  },
  link: {
    color: '#FF6B35',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
};

export default Login;
