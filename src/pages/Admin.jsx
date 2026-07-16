import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('pedidos');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCat, setProductCat] = useState('');
  const [productImage, setProductImage] = useState('');

  // Income Form State
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [incomeProduct, setIncomeProduct] = useState(null);
  const [incomeQty, setIncomeQty] = useState('1');
  const [incomeTotal, setIncomeTotal] = useState('');
  const [incomeDate, setIncomeDate] = useState('');

  // Filters State for Incomes
  const [filterProduct, setFilterProduct] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const fetchPedidosYProductos = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [pedRes, prodRes, catRes] = await Promise.all([
        fetch('http://localhost:5000/api/pedidos', { headers }),
        fetch('http://localhost:5000/api/productos'),
        fetch('http://localhost:5000/api/productos/categorias')
      ]);

      if (!pedRes.ok || !prodRes.ok || !catRes.ok) {
        throw new Error('Error al conectar con la API de administración.');
      }

      const pedData = await pedRes.json();
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setPedidos(pedData);
      setProductos(prodData);
      setCategorias(catData);
      
      // Si no hay categoría seleccionada por defecto en el formulario, asignarle la primera
      if (catData.length > 0 && !productCat) {
        setProductCat(catData[0].id.toString());
      }
    } catch (err) {
      setError('Inicia el servidor backend para cargar el panel de control real.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIngresos = async () => {
    if (user.rol !== 'administrador') return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      let url = 'http://localhost:5000/api/productos/ingresos?';
      if (filterProduct) url += `producto_id=${filterProduct}&`;
      if (filterStartDate) url += `fecha_inicio=${filterStartDate}&`;
      if (filterEndDate) url += `fecha_fin=${filterEndDate}&`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setIngresos(data);
      }
    } catch (err) {
      console.error('Error al cargar ingresos:', err);
    }
  };

  useEffect(() => {
    fetchPedidosYProductos();
    // Encuesta periódica cada 10 segundos para pedidos
    const interval = setInterval(fetchPedidosYProductos, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch ingresos cuando la pestaña activa cambie o los filtros se actualicen
  useEffect(() => {
    if (activeTab === 'ingresos') {
      fetchIngresos();
    }
  }, [activeTab, filterProduct, filterStartDate, filterEndDate]);

  const handleUpdateEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('No se pudo actualizar el estado.');
      
      setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, estado: nuevoEstado } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleDisponibilidad = async (productoId, estadoActual) => {
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${productoId}/disponibilidad`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ disponible: !estadoActual })
      });

      if (!response.ok) throw new Error('No se pudo actualizar el producto.');

      setProductos(productos.map(p => p.id === productoId ? { ...p, disponible: !estadoActual } : p));
    } catch (err) {
      alert(err.message);
    }
  };

  // Acciones de Productos
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const body = {
        categoria_id: parseInt(productCat || categorias[0]?.id),
        nombre: productName,
        descripcion: productDesc,
        precio: parseFloat(productPrice),
        imagen_url: productImage
      };

      let response;
      if (editingProduct) {
        response = await fetch(`http://localhost:5000/api/productos/${editingProduct.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body)
        });
      } else {
        response = await fetch('http://localhost:5000/api/productos', {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
      }

      if (!response.ok) throw new Error('No se pudo guardar el producto.');

      const data = await response.json();
      alert(data.mensaje);
      
      setShowProductForm(false);
      setEditingProduct(null);
      setProductName('');
      setProductDesc('');
      setProductPrice('');
      setProductCat(categorias[0]?.id.toString() || '');
      setProductImage('');

      fetchPedidosYProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductName(prod.nombre);
    setProductDesc(prod.descripcion || '');
    setProductPrice(prod.precio);
    setProductCat(prod.categoria_id ? prod.categoria_id.toString() : (categorias[0]?.id.toString() || ''));
    setProductImage(prod.imagen_url || '');
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('No se pudo eliminar el producto.');

      const data = await response.json();
      alert(data.mensaje);
      
      fetchPedidosYProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  // Acciones de Ingresos
  const handleSaveIncome = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/productos/ingresos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto_id: incomeProduct.id,
          cantidad: parseInt(incomeQty),
          total: parseFloat(incomeTotal),
          fecha: incomeDate || undefined
        })
      });

      if (!response.ok) throw new Error('No se pudo registrar el ingreso.');

      const data = await response.json();
      alert(data.mensaje);

      setShowIncomeForm(false);
      setIncomeProduct(null);
      setIncomeQty('1');
      setIncomeTotal('');
      setIncomeDate('');

      fetchIngresos();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Cargando panel de gestión...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <h1 style={styles.title}>Panel de Gestión Gastronómica</h1>
      
      {error && (
        <div style={styles.demoWarning}>
          ⚠️ <strong>Modo Demostración Activo:</strong> Levanta el backend e inicia sesión como Administrador o Cocinero para gestionar pedidos reales.
        </div>
      )}

      {/* Tabs de Navegación */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setActiveTab('pedidos')} 
          style={{
            ...styles.tabButton,
            ...(activeTab === 'pedidos' ? styles.activeTabButton : {})
          }}
        >
          🍳 Monitor de Pedidos
        </button>
        {user.rol === 'administrador' && (
          <>
            <button 
              onClick={() => setActiveTab('productos')} 
              style={{
                ...styles.tabButton,
                ...(activeTab === 'productos' ? styles.activeTabButton : {})
              }}
            >
              📦 Gestión de Productos
            </button>
            <button 
              onClick={() => setActiveTab('ingresos')} 
              style={{
                ...styles.tabButton,
                ...(activeTab === 'ingresos' ? styles.activeTabButton : {})
              }}
            >
              📈 Ver historial
            </button>
          </>
        )}
      </div>

      {/* Contenido según Tab Activa */}
      {activeTab === 'pedidos' && (
        <div style={styles.grid}>
          {/* Sección de Gestión de Pedidos */}
          <div style={styles.sectionCard} className="glass">
            <h2 style={styles.sectionTitle}>Monitor de Pedidos Recientes</h2>
            {pedidos.length === 0 ? (
              <p style={{ color: '#78716C', textAlign: 'center', padding: '30px' }}>No hay pedidos en cola actualmente.</p>
            ) : (
              <div style={styles.listContainer}>
                {pedidos.map(ped => (
                  <div key={ped.id} style={styles.orderItem}>
                    <div style={styles.orderHeader}>
                      <strong>Orden #{ped.id}</strong>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(ped.estado)
                      }}>
                        {ped.estado}
                      </span>
                    </div>
                    
                    <div style={styles.orderDetails}>
                      <p style={{ fontSize: '0.85rem', color: '#78716C' }}>
                        Cliente: {ped.cliente_nombre} ({ped.cliente_email}) | Tipo: {ped.tipo_pedido.toUpperCase()}
                        {ped.mesa && ` | Mesa: ${ped.mesa}`}
                      </p>
                      <ul style={styles.productsList}>
                        {ped.productos?.map((p, idx) => (
                          <li key={idx} style={{ fontSize: '0.9rem' }}>
                            • {p.nombre} x {p.cantidad}
                          </li>
                        ))}
                      </ul>
                      <p style={{ fontWeight: 'bold', marginTop: '6px' }}>Total: ${parseFloat(ped.total).toFixed(2)}</p>
                    </div>

                    <div style={styles.actionsRow}>
                      <button 
                        onClick={() => handleUpdateEstado(ped.id, 'En Preparacion')}
                        style={styles.actionBtn}
                        disabled={ped.estado === 'En Preparacion' || ped.estado === 'Listo para Entrega' || ped.estado === 'Entregado'}
                      >
                        🍳 Preparar
                      </button>
                      <button 
                        onClick={() => handleUpdateEstado(ped.id, 'Listo para Entrega')}
                        style={styles.actionBtn}
                        disabled={ped.estado === 'Listo para Entrega' || ped.estado === 'Entregado'}
                      >
                        🛎️ Listo
                      </button>
                      <button 
                        onClick={() => handleUpdateEstado(ped.id, 'Entregado')}
                        style={styles.actionBtnSuccess}
                        disabled={ped.estado === 'Entregado'}
                      >
                        ✅ Entregado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Gestión de Disponibilidad */}
          <div style={styles.sectionCard} className="glass">
            <h2 style={styles.sectionTitle}>Control de Stock / Menú</h2>
            {productos.length === 0 ? (
              <p style={{ color: '#78716C', textAlign: 'center', padding: '30px' }}>Menú vacío.</p>
            ) : (
              <div style={styles.listContainer}>
                {productos.map(prod => (
                  <div key={prod.id} style={styles.productRow}>
                    <div style={{ flexGrow: 1 }}>
                      <strong>{prod.nombre}</strong>
                      <p style={{ fontSize: '0.85rem', color: '#78716C' }}>${parseFloat(prod.price || prod.precio).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleToggleDisponibilidad(prod.id, prod.disponible)}
                      style={{
                        ...styles.toggleBtn,
                        backgroundColor: prod.disponible ? '#D1FAE5' : '#FEE2E2',
                        color: prod.disponible ? '#065F46' : '#991B1B'
                      }}
                    >
                      {prod.disponible ? 'Disponible' : 'Agotado'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'productos' && (
        <div style={styles.sectionCard} className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Catálogo de Productos</h2>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setProductName('');
                setProductDesc('');
                setProductPrice('');
                setProductCat(categorias[0]?.id.toString() || '1');
                setProductImage('');
                setShowProductForm(true);
              }} 
              style={styles.btnPrimary}
            >
              ➕ Agregar producto
            </button>
          </div>

          {/* Formulario de Producto */}
          {showProductForm && (
            <div style={styles.formContainer} className="glass">
              <h3 style={{ marginBottom: '15px' }}>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
              <form onSubmit={handleSaveProduct}>
                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Nombre del producto</label>
                    <input 
                      type="text" 
                      required 
                      value={productName} 
                      onChange={(e) => setProductName(e.target.value)} 
                      style={styles.input}
                      placeholder="Ej. Ceviche Mixto"
                    />
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Categoría</label>
                    <select 
                      value={productCat} 
                      onChange={(e) => setProductCat(e.target.value)} 
                      style={styles.input}
                      required
                    >
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id.toString()}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Precio</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      required 
                      value={productPrice} 
                      onChange={(e) => setProductPrice(e.target.value)} 
                      style={styles.input}
                      placeholder="0.00"
                    />
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Imagen del producto (subida desde el dispositivo)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      style={styles.input}
                    />
                    {productImage && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#78716C' }}>Vista previa:</span>
                        <img src={productImage} alt="Preview" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...styles.formCol, marginBottom: '15px' }}>
                  <label style={styles.formLabel}>Descripción</label>
                  <textarea 
                    value={productDesc} 
                    onChange={(e) => setProductDesc(e.target.value)} 
                    style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                    placeholder="Detalles sobre los ingredientes o preparación del plato..."
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={styles.btnSave}>Guardar</button>
                  <button type="button" onClick={() => setShowProductForm(false)} style={styles.btnCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Formulario de Registrar Ingreso */}
          {showIncomeForm && (
            <div style={{ ...styles.formContainer, borderColor: '#10B981', borderStyle: 'dashed', marginBottom: '20px' }} className="glass">
              <h3 style={{ marginBottom: '15px', color: '#065F46' }}>💸 Registrar ingreso - {incomeProduct?.nombre}</h3>
              <form onSubmit={handleSaveIncome}>
                <div style={styles.formRow}>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Cantidad vendida</label>
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      value={incomeQty} 
                      onChange={(e) => {
                        const qty = e.target.value;
                        setIncomeQty(qty);
                        if (incomeProduct) {
                          setIncomeTotal((parseFloat(incomeProduct.precio) * parseInt(qty || 0)).toFixed(2));
                        }
                      }} 
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formCol}>
                    <label style={styles.formLabel}>Total del ingreso ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      required 
                      value={incomeTotal} 
                      onChange={(e) => setIncomeTotal(e.target.value)} 
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ ...styles.formCol, marginBottom: '15px' }}>
                  <label style={styles.formLabel}>Fecha del ingreso</label>
                  <input 
                    type="datetime-local" 
                    value={incomeDate} 
                    onChange={(e) => setIncomeDate(e.target.value)} 
                    style={styles.input}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={styles.btnSaveIncome}>Registrar ingreso</button>
                  <button type="button" onClick={() => setShowIncomeForm(false)} style={styles.btnCancel}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla de Productos */}
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id} style={styles.tableRow}>
                    <td>
                      {prod.imagen_url ? (
                        <img src={prod.imagen_url} alt={prod.nombre} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#A8A29E' }}>🍲</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{prod.nombre}</td>
                    <td>{prod.categoria_nombre || 'N/A'}</td>
                    <td style={{ fontWeight: 'bold', color: '#FF6B35' }}>${parseFloat(prod.precio).toFixed(2)}</td>
                    <td style={{ fontSize: '0.85rem', color: '#78716C', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.descripcion || 'Sin descripción'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditProduct(prod)} style={styles.btnEdit}>Editar</button>
                        <button onClick={() => handleDeleteProduct(prod.id)} style={styles.btnDelete}>Eliminar</button>
                        <button 
                          onClick={() => {
                            setIncomeProduct(prod);
                            setIncomeQty('1');
                            setIncomeTotal(prod.precio);
                            setIncomeDate(new Date().toISOString().substring(0, 16));
                            setShowIncomeForm(true);
                          }} 
                          style={styles.btnIncome}
                        >
                          💸 Registrar ingreso
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ingresos' && (
        <div style={styles.sectionCard} className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Historial de Ingresos</h2>
            <div style={styles.incomeTotalBadge}>
              Total Acumulado: <strong style={{ fontSize: '1.25rem', color: '#10B981' }}>${ingresos.reduce((sum, ing) => sum + parseFloat(ing.total), 0).toFixed(2)}</strong>
            </div>
          </div>

          {/* Filtros */}
          <div style={styles.filtersContainer}>
            <div style={styles.filterCol}>
              <label style={styles.filterLabel}>Filtrar por Producto</label>
              <select 
                value={filterProduct} 
                onChange={(e) => setFilterProduct(e.target.value)} 
                style={styles.filterInput}
              >
                <option value="">Todos los productos</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterCol}>
              <label style={styles.filterLabel}>Fecha Inicio</label>
              <input 
                type="date" 
                value={filterStartDate} 
                onChange={(e) => setFilterStartDate(e.target.value)} 
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterCol}>
              <label style={styles.filterLabel}>Fecha Fin</label>
              <input 
                type="date" 
                value={filterEndDate} 
                onChange={(e) => setFilterEndDate(e.target.value)} 
                style={styles.filterInput}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                onClick={() => {
                  setFilterProduct('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                }} 
                style={styles.btnResetFilters}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Tabla de Historial */}
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th>Fecha del ingreso</th>
                  <th>Producto vendido</th>
                  <th>Cantidad</th>
                  <th>Total del ingreso</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#78716C' }}>
                      No se encontraron registros de ingresos.
                    </td>
                  </tr>
                ) : (
                  ingresos.map(ing => (
                    <tr key={ing.id} style={styles.tableRow}>
                      <td>
                        {new Date(ing.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{ing.producto_nombre || 'Producto Eliminado'}</td>
                      <td>{ing.cantidad}</td>
                      <td style={{ fontWeight: 'bold', color: '#10B981' }}>${parseFloat(ing.total).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '30px',
  },
  demoWarning: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    padding: '15px 20px',
    borderRadius: '12px',
    border: '1px solid #FDE68A',
    marginBottom: '30px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    borderBottom: '1px solid #E7E5E4',
    paddingBottom: '10px',
  },
  tabButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    color: '#78716C',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTabButton: {
    background: '#FFEFEA',
    color: '#FF6B35',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '30px',
  },
  sectionCard: {
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    marginBottom: '20px',
    borderBottom: '2px solid #E7E5E4',
    paddingBottom: '8px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '600px',
    overflowY: 'auto',
    paddingRight: '6px',
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E7E5E4',
    borderRadius: '12px',
    padding: '16px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '4px 10px',
    borderRadius: '20px',
    color: '#1C1917',
  },
  productsList: {
    listStyleType: 'none',
    padding: '6px 0',
  },
  actionsRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    borderTop: '1px solid #F5F5F4',
    paddingTop: '12px',
  },
  actionBtn: {
    flexGrow: 1,
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #E7E5E4',
    background: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  actionBtnSuccess: {
    flexGrow: 1,
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    background: '#10B981',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #E7E5E4',
  },
  toggleBtn: {
    border: 'none',
    padding: '6px 12px',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  btnPrimary: {
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  formContainer: {
    backgroundColor: '#FAF9F6',
    border: '1px solid #E7E5E4',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '25px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '15px',
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#44403C',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #E7E5E4',
    fontSize: '0.95rem',
    backgroundColor: '#FFFFFF',
  },
  btnSave: {
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnSaveIncome: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnCancel: {
    backgroundColor: '#FFFFFF',
    color: '#78716C',
    border: '1px solid #E7E5E4',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tableResponsive: {
    overflowX: 'auto',
    marginTop: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #E7E5E4',
  },
  tableRow: {
    borderBottom: '1px solid #F5F5F4',
  },
  btnEdit: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  btnDelete: {
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  btnIncome: {
    backgroundColor: '#ECFDF5',
    color: '#047857',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  incomeTotalBadge: {
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    padding: '8px 16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  filtersContainer: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#FAF9F6',
    border: '1px solid #E7E5E4',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flexGrow: 1,
    minWidth: '150px',
  },
  filterLabel: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#78716C',
  },
  filterInput: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #E7E5E4',
    fontSize: '0.9rem',
    backgroundColor: '#FFFFFF',
  },
  btnResetFilters: {
    backgroundColor: '#FFFFFF',
    color: '#78716C',
    border: '1px solid #E7E5E4',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
    height: '38px',
  }
};

export default Admin;
