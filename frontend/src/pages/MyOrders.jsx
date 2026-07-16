import React, { useState, useEffect } from 'react';

const MyOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchMisPedidos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pedidos/mis-pedidos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el historial de pedidos.');
      }

      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError('Inicia el servidor backend para cargar tu historial de pedidos real.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMisPedidos();
      // Refrescar cada 15 segundos para ver actualizaciones de estado
      const interval = setInterval(fetchMisPedidos, 15000);
      return () => clearInterval(interval);
    }
  }, [token]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando tus pedidos...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <h1 style={styles.title}>Mis Pedidos</h1>
      <p style={styles.subtitle}>Sigue tus pedidos en tiempo real y revisa tus compras anteriores</p>

      {error ? (
        <div style={styles.errorCard}>
          <span style={{ fontSize: '3rem' }}>🔌</span>
          <h3 style={{ marginTop: '10px', color: '#B91C1C' }}>Modo de Demostración</h3>
          <p style={{ color: '#78716C', maxWidth: '500px', margin: '8px auto' }}>{error}</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '3rem' }}>🍽️</span>
          <h3 style={{ marginTop: '10px' }}>Aún no tienes pedidos</h3>
          <p style={{ color: '#78716C', margin: '6px 0 18px' }}>Realiza tu primera orden en Restaurate hoy mismo.</p>
        </div>
      ) : (
        <div style={styles.ordersGrid}>
          {pedidos.map(ped => (
            <div key={ped.id} style={styles.orderCard} className="glass">
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={{ fontSize: '1.2rem' }}>Orden #{ped.id}</h3>
                  <span style={styles.dateText}>
                    {new Date(ped.fecha_pedido).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(ped.estado)
                }}>
                  {ped.estado}
                </span>
              </div>

              <div style={styles.orderBody}>
                <p style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '8px' }}>
                  Servicio: <strong>{ped.tipo_pedido.toUpperCase()}</strong> 
                  {ped.mesa && ` | Mesa: ${ped.mesa}`}
                </p>
                <div style={styles.productsBox}>
                  {ped.productos?.map((prod, idx) => (
                    <div key={idx} style={styles.productLine}>
                      <span>{prod.nombre} x {prod.cantidad}</span>
                      <span>${(parseFloat(prod.precio) * prod.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.totalRow}>
                  <span>Total Pagado:</span>
                  <span style={styles.totalPrice}>${parseFloat(ped.total).toFixed(2)}</span>
                </div>
                <div style={styles.pointsEarned}>
                  ⭐ Ganaste <strong>{ped.puntos_ganados}</strong> puntos estrella
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getStatusColor = (estado) => {
  switch (estado) {
    case 'Creado': return '#E0F2FE';
    case 'Pagado': return '#FEF3C7';
    case 'En Preparacion': return '#FFEFEA';
    case 'Listo para Entrega': return '#D1FAE5';
    case 'Entregado': return '#DCFCE7';
    default: return '#F3F4F6';
  }
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '2.2rem',
  },
  subtitle: {
    color: '#78716C',
    marginTop: '6px',
    marginBottom: '40px',
  },
  errorCard: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '18px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '18px',
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  orderCard: {
    padding: '24px',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #E7E5E4',
    paddingBottom: '12px',
    marginBottom: '15px',
  },
  dateText: {
    fontSize: '0.8rem',
    color: '#78716C',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#1C1917',
  },
  orderBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  productsBox: {
    backgroundColor: '#FAF9F6',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '15px',
  },
  productLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E7E5E4',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  totalPrice: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  pointsEarned: {
    fontSize: '0.8rem',
    color: '#D97706',
    textAlign: 'center',
  }
};

export default MyOrders;
