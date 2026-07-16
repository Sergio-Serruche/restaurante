import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getRoleBadgeStyle = (rol) => {
  switch (rol) {
    case 'administrador':
      return {
        backgroundColor: '#FFE4E6',
        color: '#E11D48',
      };
    case 'cocinero':
      return {
        backgroundColor: '#E0F2FE',
        color: '#0369A1',
      };
    case 'cliente':
    default:
      return {
        backgroundColor: '#F3F4F6',
        color: '#4B5563',
      };
  }
};

const getRoleLabel = (rol) => {
  switch (rol) {
    case 'administrador': return 'Administrador';
    case 'cocinero': return 'Cocinero';
    case 'cliente': return 'Cliente';
    default: return rol || '';
  }
};

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={{ fontSize: '1.6rem' }}>🍳</span> Restaurate
        </Link>
        
        <div style={styles.menuLinks}>
          <Link to="/menu" style={styles.link}>Menú</Link>
          <Link to="/carrito" style={styles.link}>
            Carrito {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
          
          {token && (
            <>
              <Link to="/mis-pedidos" style={styles.link}>Mis Pedidos</Link>
              {(user.rol === 'administrador' || user.rol === 'cocinero') && (
                <Link to="/admin" style={styles.adminLink}>Panel Gestión</Link>
              )}
            </>
          )}
        </div>

        <div style={styles.authSection}>
          {token ? (
            <div style={styles.userContainer}>
              <span style={styles.userInfo}>
                Hola, <strong>{user.nombre}</strong> 
                {user.rol && (
                  <span style={{
                    ...styles.roleBadge,
                    ...getRoleBadgeStyle(user.rol)
                  }}>
                    {getRoleLabel(user.rol)}
                  </span>
                )}
                <span style={styles.pointsBadge}>⭐ {user.puntos_fidelidad || 0} pts</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Salir
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Entrar
              </Link>
              <Link to="/registro" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E7E5E4',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '12px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#FF6B35',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    color: '#1C1917',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    position: 'relative',
    transition: 'color 0.2s',
  },
  adminLink: {
    color: '#1A5F7A',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  badge: {
    backgroundColor: '#FF6B35',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    padding: '2px 6px',
    marginLeft: '4px',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userInfo: {
    fontSize: '0.9rem',
    color: '#78716C',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  roleBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  pointsBadge: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  }
};

export default Navbar;
