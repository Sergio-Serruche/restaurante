import React, { useState, useEffect } from 'react';

const Menu = ({ onAddToCart }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('http://localhost:5000/api/productos'),
          fetch('http://localhost:5000/api/productos/categorias')
        ]);

        if (!prodRes.ok || !catRes.ok) {
          throw new Error('No se pudo conectar con el servidor.');
        }

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProductos(prodData);
        setCategorias(catData);
      } catch (err) {
        setError('Error al conectar con la base de datos de Restaurate. Inicia el servidor backend para ver el menú.');
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const productosFiltrados = categoriaSeleccionada === 'todas'
    ? productos
    : productos.filter(p => p.categoria_id === parseInt(categoriaSeleccionada));

  const getEmojiForCategory = (nombre) => {
    switch (nombre.toLowerCase()) {
      case 'entradas': return '🥟';
      case 'platos fuertes': return '🍛';
      case 'bebidas': return '🥤';
      case 'postres': return '🍰';
      default: return '🍴';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '15px', color: '#78716C' }}>Cargando Menú de Restaurate...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>Menú Digital</h1>
        <p style={styles.subtitle}>Selecciona tus platos favoritos elaborados con insumos frescos de alta calidad</p>
      </div>

      {error ? (
        <div style={styles.errorCard}>
          <span style={{ fontSize: '3rem' }}>🔌</span>
          <h3 style={{ marginTop: '10px', color: '#B91C1C' }}>Modo de Demostración Activo</h3>
          <p style={{ color: '#78716C', maxWidth: '500px', margin: '8px auto' }}>{error}</p>
          <p style={{ fontSize: '0.85rem', color: '#A8A29E' }}>Sugerencia: Abre tu consola PostgreSQL, crea la base de datos y corre `npm run dev` en la carpeta backend.</p>
        </div>
      ) : (
        <>
          {/* Filtros de Categorías */}
          <div style={styles.categoriesBar}>
            <button
              onClick={() => setCategoriaSeleccionada('todas')}
              style={{
                ...styles.categoryBtn,
                backgroundColor: categoriaSeleccionada === 'todas' ? '#FF6B35' : '#FFFFFF',
                color: categoriaSeleccionada === 'todas' ? '#FFFFFF' : '#1C1917',
                borderColor: categoriaSeleccionada === 'todas' ? '#FF6B35' : '#E7E5E4'
              }}
            >
              🍔 Todas
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                style={{
                  ...styles.categoryBtn,
                  backgroundColor: categoriaSeleccionada === cat.id ? '#FF6B35' : '#FFFFFF',
                  color: categoriaSeleccionada === cat.id ? '#FFFFFF' : '#1C1917',
                  borderColor: categoriaSeleccionada === cat.id ? '#FF6B35' : '#E7E5E4'
                }}
              >
                {getEmojiForCategory(cat.nombre)} {cat.nombre}
              </button>
            ))}
          </div>

          {/* Menú de Platos */}
          <div className="menu-grid">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className="card-producto">
                <div className="card-img-container">
                  <div className="card-img-placeholder">
                    {getEmojiForCategory(prod.categoria_nombre || '')}
                  </div>
                  {!prod.disponible && (
                    <div style={styles.soldOutBadge}>Agotado</div>
                  )}
                </div>
                <div className="card-content">
                  <h3 className="card-title">{prod.nombre}</h3>
                  <p className="card-desc">{prod.descripcion || 'Sin descripción disponible.'}</p>
                  
                  <div className="card-footer">
                    <span className="card-price">${parseFloat(prod.precio).toFixed(2)}</span>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      disabled={!prod.disponible}
                      onClick={() => onAddToCart(prod)}
                    >
                      {prod.disponible ? 'Añadir +' : 'Agotado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1C1917',
  },
  subtitle: {
    color: '#78716C',
    marginTop: '8px',
    fontSize: '1.1rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E7E5E4',
    borderTop: '4px solid #FF6B35',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  categoriesBar: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '16px',
    marginBottom: '30px',
  },
  categoryBtn: {
    padding: '10px 18px',
    borderRadius: '30px',
    border: '1px solid',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  soldOutBadge: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    textTransform: 'uppercase',
  },
  errorCard: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  }
};

export default Menu;
