import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = ({ cartItems, onRemoveFromCart, onClearCart }) => {
  const [tipoPedido, setTipoPedido] = useState('local');
  const [mesa, setMesa] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const calcularTotal = () => {
    return cartItems.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    if (tipoPedido === 'local' && !mesa) {
      setError('Por favor, indica tu número de mesa.');
      return;
    }

    if (tipoPedido === 'delivery' && !direccion) {
      setError('Por favor, ingresa tu dirección de entrega.');
      return;
    }

    setLoading(true);
    setError('');

    // Preparar el cuerpo del pedido
    const productosPayload = cartItems.map(item => ({
      producto_id: item.id,
      cantidad: item.cantidad
    }));

    try {
      // Registrar dirección primero si es delivery (para simplificar en demostración)
      let direccionId = null;
      if (tipoPedido === 'delivery') {
        const dirRes = await fetch('http://localhost:5000/api/auth/perfil'); // Solo para simular
        // En un caso real tendríamos un endpoint para guardar direcciones. 
        // Para simplificar, le mandaremos null al servicio de pedidos y el backend lo manejará o usará una dirección de base.
      }

      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_pedido: tipoPedido,
          productos: productosPayload,
          mesa: tipoPedido === 'local' ? mesa : null,
          direccion_id: null, // Simplificado
          metodo_pago: metodoPago
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al procesar el checkout.');
      }

      // Sumar los puntos obtenidos al usuario en localstorage
      const puntosObtenidos = Math.floor(calcularTotal() / 10);
      user.puntos_fidelidad = (user.puntos_fidelidad || 0) + puntosObtenidos;
      localStorage.setItem('user', JSON.stringify(user));

      setSuccessOrder(data.pedido);
      onClearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div style={styles.container} className="animate-fade-in">
        <div style={styles.successCard} className="glass">
          <span style={{ fontSize: '4rem' }}>🎉</span>
          <h2 style={{ color: '#10B981', marginTop: '10px' }}>¡Pedido Recibido con Éxito!</h2>
          <p style={{ margin: '15px 0', color: '#78716C' }}>
            Tu orden **#{successOrder.id}** ha sido procesada correctamente y ya está en cocina.
          </p>
          <div style={styles.orderDetailsBox}>
            <p><strong>Tipo de Servicio:</strong> {successOrder.tipo_pedido.toUpperCase()}</p>
            {successOrder.mesa && <p><strong>Mesa:</strong> {successOrder.mesa}</p>}
            <p><strong>Monto Total:</strong> ${parseFloat(successOrder.total).toFixed(2)}</p>
            <p><strong>Estado:</strong> {successOrder.estado}</p>
            <p style={{ color: '#D97706', fontWeight: 'bold' }}>⭐ ¡Ganaste {successOrder.puntos_ganados} puntos estrella!</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
            <Link to="/mis-pedidos" className="btn btn-secondary">Ver Mis Pedidos</Link>
            <Link to="/menu" className="btn btn-primary">Volver al Menú</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <h1 style={styles.title}>Tu Carrito</h1>
      
      {cartItems.length === 0 ? (
        <div style={styles.emptyCartCard}>
          <span style={{ fontSize: '3.5rem' }}>🛒</span>
          <h3 style={{ marginTop: '10px' }}>Tu carrito está vacío</h3>
          <p style={{ color: '#78716C', margin: '8px 0 20px' }}>Agrega deliciosos platos desde nuestro menú digital.</p>
          <Link to="/menu" className="btn btn-primary">Ver Menú</Link>
        </div>
      ) : (
        <div style={styles.cartLayout}>
          {/* Listado de Platos */}
          <div style={styles.cartList}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.cartItemCard}>
                <div style={styles.itemEmoji}>🍲</div>
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.05rem' }}>{item.nombre}</h4>
                  <p style={{ color: '#78716C', fontSize: '0.85rem' }}>
                    ${parseFloat(item.precio).toFixed(2)} x {item.cantidad}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={styles.itemSubtotal}>
                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    style={styles.deleteBtn}
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            
            <div style={styles.summaryRow}>
              <span>Subtotal del menú</span>
              <strong>${calcularTotal().toFixed(2)}</strong>
            </div>
          </div>

          {/* Formulario de Checkout */}
          <div style={styles.checkoutForm} className="glass">
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #E7E5E4', paddingBottom: '10px' }}>
              Finalizar Pedido
            </h3>

            {error && <div style={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Modalidad de Pedido</label>
                <select
                  className="form-control"
                  value={tipoPedido}
                  onChange={(e) => setTipoPedido(e.target.value)}
                >
                  <option value="local">Consumo en Local (Mesa)</option>
                  <option value="pick-up">Recojo en Tienda (Llevar)</option>
                  <option value="delivery">Envío a Domicilio (Delivery)</option>
                </select>
              </div>

              {tipoPedido === 'local' && (
                <div className="form-group">
                  <label className="form-label">Número de Mesa</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Ej. 12"
                    required
                    value={mesa}
                    onChange={(e) => setMesa(e.target.value)}
                  />
                </div>
              )}

              {tipoPedido === 'delivery' && (
                <div className="form-group">
                  <label className="form-label">Dirección de Entrega</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Av. Principal 123, Dpto 402"
                    required
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <div style={styles.paymentRadioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={metodoPago === 'tarjeta'}
                      onChange={() => setMetodoPago('tarjeta')}
                    />
                    💳 Tarjeta de Crédito (Simulada)
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={metodoPago === 'efectivo'}
                      onChange={() => setMetodoPago('efectivo')}
                    />
                    💵 Efectivo contra entrega
                  </label>
                </div>
              </div>

              <div style={styles.totalBox}>
                <span>Total a Pagar:</span>
                <span style={styles.totalPrice}>${calcularTotal().toFixed(2)}</span>
              </div>

              {!token ? (
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                >
                  Inicia Sesión para Confirmar
                </Link>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                  disabled={loading}
                >
                  {loading ? 'Confirmando pedido...' : 'Realizar Pedido'}
                </button>
              )}
            </form>
          </div>
        </div>
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
  title: {
    fontSize: '2.2rem',
    marginBottom: '30px',
  },
  emptyCartCard: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '18px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  cartLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px',
    alignItems: 'start',
  },
  cartList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  cartItemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#FFFFFF',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #E7E5E4',
  },
  itemEmoji: {
    fontSize: '2rem',
    backgroundColor: '#FAF9F6',
    padding: '8px',
    borderRadius: '8px',
  },
  itemSubtotal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    borderTop: '2px dashed #E7E5E4',
    fontSize: '1.1rem',
  },
  checkoutForm: {
    padding: '30px 24px',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  },
  paymentRadioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '6px',
  },
  radioLabel: {
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderTop: '1px solid #E7E5E4',
    borderBottom: '1px solid #E7E5E4',
    margin: '20px 0',
  },
  totalPrice: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#FF6B35',
  },
  errorAlert: {
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  successCard: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '50px 30px',
    borderRadius: '18px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
  orderDetailsBox: {
    backgroundColor: '#FAF9F6',
    border: '1px solid #E7E5E4',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'left',
    maxWidth: '400px',
    margin: '20px auto 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }
};

export default Cart;
