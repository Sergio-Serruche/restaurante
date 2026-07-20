import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { Users, ShoppingCart, DollarSign, TrendingUp, Utensils, Edit, Trash2, X, PackagePlus, Search, LogOut, Eye } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { products, orders, reservations, users, addProduct, editProduct, deleteProduct, editUserRole, editUserAdmin, deleteUser, updateOrderStatus, updateReservationStatus, deleteReservation, refreshUsers } = useApp();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [spf, setSpf] = useState(false);
  const [ept, setEpt] = useState(null);
  const [pf, setPf] = useState({ nombre: "", descripcion: "", precio: "", categoria: "Platos", imagen: "", calificacion: 5 });
  const [st, setSt] = useState("");
  const [of, setOf] = useState("Todos");
  const [su, setSu] = useState("");
  const [eu, setEu] = useState(null);
  const categories = ["Platos", "Entradas", "Bebidas Frias", "Bebidas Calientes", "Postres"];
  const catEmoji = { Platos: "Platos", Entradas: "Entradas", "Bebidas Frias": "Bebidas Frias", "Bebidas Calientes": "Bebidas Calientes", Postres: "Postres" };

  const revenue = orders.filter(o => o.estado !== "Cancelado").reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
  const todaySales = orders.filter(o => o.estado !== "Cancelado" && new Date(o.fecha).toDateString() === new Date().toDateString()).reduce((s, o) => s + (parseFloat(o.total) || 0), 0);

  const filteredOrders = useMemo(() => of === "Todos" ? orders : orders.filter(o => o.estado === of), [orders, of]);
  const filteredProducts = useMemo(() => {
    if (!st.trim()) return products;
    return products.filter(p => p.nombre.toLowerCase().includes(st.toLowerCase()));
  }, [products, st]);
  const filteredUsers = useMemo(() => {
    if (!su.trim()) return users;
    return users.filter(u => u.nombre?.toLowerCase().includes(su.toLowerCase()) || u.email?.toLowerCase().includes(su.toLowerCase()));
  }, [users, su]);

  const revenueChart = useMemo(() => {
    const d = Array(7).fill(0); const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    orders.filter(o => o.estado !== "Cancelado").forEach(o => { d[new Date(o.fecha).getDay()] += parseFloat(o.total) || 0; });
    return { labels: days, data: d };
  }, [orders]);

  const popProd = useMemo(() => {
    const map = {};
    orders.forEach(o => { if (o.items) o.items.forEach(i => { if (!map[i.id]) map[i.id] = { nombre: i.nombre, count: 0 }; map[i.id].count += i.cantidad || 1; }); });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

  const monthlyRes = useMemo(() => { const d = Array(12).fill(0); reservations.forEach(r => d[new Date(r.fecha).getMonth()]++); return d; }, [reservations]);
  const userGrowth = useMemo(() => { const l = users.length; return Array(12).fill(0).map((_, i) => Math.floor(l * (i + 1) / 12)); }, [users]);

  const barData = { labels: revenueChart.labels, datasets: [{ label: "Ventas (S/)", data: revenueChart.data, backgroundColor: "#DC2626", borderRadius: 8 }] };
  const userData = { labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"], datasets: [{ label: "Usuarios", data: userGrowth, backgroundColor: "#F97316", borderRadius: 4 }] };
  const resData = { labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"], datasets: [{ label: "Reservas", data: monthlyRes, backgroundColor: "#FACC15", borderRadius: 4 }] };
  const pieData = { labels: popProd.map(p => p.nombre.substring(0, 15)), datasets: [{ data: popProd.map(p => p.count), backgroundColor: ["#DC2626", "#F97316", "#FACC15", "#111827", "#3B82F6"] }] };

  const ipt = "w-full px-4 py-2.5 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none";
  const lbl = "text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600";
  const bp = "px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-sm font-bold rounded-xl transition-all duration-200";
  const bo = "px-5 py-2.5 bg-light hover:bg-gray-200 text-dark text-sm font-bold rounded-xl transition-all";

  const EditModal = () => null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display font-extrabold text-3xl text-dark">Panel Admin</h1>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"><LogOut className="h-4 w-4" /> Salir</button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["dashboard", "pedidos", "productos", "usuarios", "reservas"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={"px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all " + (tab === t ? "bg-primary text-white shadow-premium" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200")}>
              {t === "dashboard" ? "Dashboard" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2"><div className="p-3 bg-primary/10 rounded-2xl"><Users className="h-6 w-6 text-primary" /></div><h3 className="text-sm font-medium text-gray-500">Usuarios</h3></div>
                <p className="text-3xl font-extrabold text-dark">{users.length}</p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2"><div className="p-3 bg-primary-orange/10 rounded-2xl"><ShoppingCart className="h-6 w-6 text-primary-orange" /></div><h3 className="text-sm font-medium text-gray-500">Pedidos</h3></div>
                <p className="text-3xl font-extrabold text-dark">{orders.length}</p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2"><div className="p-3 bg-green-100 rounded-2xl"><DollarSign className="h-6 w-6 text-green-600" /></div><h3 className="text-sm font-medium text-gray-500">Ventas Hoy</h3></div>
                <p className="text-3xl font-extrabold text-dark">S/ {todaySales.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2"><div className="p-3 bg-gold/20 rounded-2xl"><TrendingUp className="h-6 w-6 text-gold" /></div><h3 className="text-sm font-medium text-gray-500">Ganancias</h3></div>
                <p className="text-3xl font-extrabold text-dark">S/ {revenue.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <h3 className="font-display font-bold text-lg mb-4">Ventas por Dia</h3>
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <h3 className="font-display font-bold text-lg mb-4">Productos Mas Vendidos</h3>
                {popProd.length > 0 ? <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} /> : <p className="text-gray-500 text-sm">Sin datos aun</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <h3 className="font-display font-bold text-lg mb-4">Usuarios Registrados</h3>
                <Bar data={userData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6">
                <h3 className="font-display font-bold text-lg mb-4">Reservas Mensuales</h3>
                <Bar data={resData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
        )}

        {tab === "pedidos" && (
          <div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["Todos", "Pendiente", "Preparando", "En camino", "Entregado", "Cancelado"].map(s => (
                <button key={s} onClick={() => setOf(s)}
                  className={"px-4 py-2 rounded-xl text-xs font-bold transition-all " + (of === s ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200")}>{s}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.length === 0 ? <p className="text-gray-500 col-span-2 text-center py-10">No hay pedidos</p> :
                filteredOrders.map(o => (
                  <div key={o.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div><p className="font-bold text-dark">#{o.id}</p><p className="text-xs text-gray-500">{o.cliente}</p></div>
                      <span className={"text-xs font-bold px-3 py-1 rounded-full " + (o.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" : o.estado === "Preparando" ? "bg-blue-100 text-blue-700" : o.estado === "En camino" ? "bg-indigo-100 text-indigo-700" : o.estado === "Entregado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{o.estado}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{o.distrito} - {o.metodoPago}</p>
                    <div className="text-sm space-y-0.5 mb-3">
                      {o.items?.map((i, idx) => <p key={idx} className="text-gray-600">{i.nombre} x{i.cantidad}</p>)}
                    </div>
                    <p className="font-extrabold text-primary text-lg mb-3">S/ {parseFloat(o.total).toFixed(2)}</p>
                    <div className="flex gap-2">
                      {o.estado === "Pendiente" && <button onClick={() => updateOrderStatus(o.id, "Preparando")} className={bo}>Preparando</button>}
                      {o.estado === "Preparando" && <button onClick={() => updateOrderStatus(o.id, "En camino")} className={bo}>En camino</button>}
                      {o.estado === "En camino" && <button onClick={() => updateOrderStatus(o.id, "Entregado")} className={bp}>Entregado</button>}
                      {o.estado !== "Entregado" && o.estado !== "Cancelado" && <button onClick={() => updateOrderStatus(o.id, "Cancelado")} className="px-4 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">Cancelar</button>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === "productos" && (
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                <input type="text" value={st} onChange={e => setSt(e.target.value)} placeholder="Buscar producto..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <button onClick={() => { setEpt(null); setPf({ nombre: "", descripcion: "", precio: "", categoria: "Platos", imagen: "", calificacion: 5 }); setSpf(true); }}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl shadow-premium text-sm"><PackagePlus className="h-4 w-4" /> Agregar</button>
            </div>

            {spf && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center" onClick={() => setSpf(false)}>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-8 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6"><h3 className="font-display font-bold text-xl">{ept ? "Editar" : "Nuevo"} Producto</h3><button onClick={() => setSpf(false)}><X className="h-5 w-5 text-gray-400" /></button></div>
                  <form onSubmit={e => { e.preventDefault(); const d = { ...pf, precio: parseFloat(pf.precio), calificacion: parseFloat(pf.calificacion) || 5 }; if (ept) { editProduct(ept.id, d); } else { addProduct(d); } setSpf(false); alert(ept ? "Producto actualizado" : "Producto agregado"); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Nombre</label><input type="text" required value={pf.nombre} onChange={e => setPf({ ...pf, nombre: e.target.value })} className={ipt} /></div>
                      <div><label className={lbl}>Categoria</label><select value={pf.categoria} onChange={e => setPf({ ...pf, categoria: e.target.value })} className={ipt}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Precio (S/)</label><input type="number" step="0.01" required value={pf.precio} onChange={e => setPf({ ...pf, precio: e.target.value })} className={ipt} /></div>
                      <div><label className={lbl}>Calificacion</label><input type="number" step="0.1" min="0" max="5" value={pf.calificacion} onChange={e => setPf({ ...pf, calificacion: e.target.value })} className={ipt} /></div>
                    </div>
                    <div><label className={lbl}>Descripcion</label><textarea rows="2" required value={pf.descripcion} onChange={e => setPf({ ...pf, descripcion: e.target.value })} className={ipt} /></div>
                    <div><label className={lbl}>URL de imagen</label><input type="text" value={pf.imagen} onChange={e => setPf({ ...pf, imagen: e.target.value })} placeholder="https://..." className={ipt} /></div>
                    <div className="flex gap-3">
                      <button type="submit" className={bp}>Guardar</button>
                      <button type="button" onClick={() => setSpf(false)} className={bo}>Cancelar</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light">
                    <tr><th className="text-left p-4 font-bold text-gray-500">Producto</th><th className="text-left p-4 font-bold text-gray-500">Categoria</th><th className="text-right p-4 font-bold text-gray-500">Precio</th><th className="text-center p-4 font-bold text-gray-500">Calif</th><th className="text-right p-4 font-bold text-gray-500">Acciones</th></tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-light/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop"} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          <span className="font-bold text-dark">{p.nombre}</span>
                        </td>
                        <td className="p-4 text-gray-500">{p.categoria}</td>
                        <td className="p-4 text-right font-bold">S/ {parseFloat(p.precio).toFixed(2)}</td>
                        <td className="p-4 text-center">{p.calificacion}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setEpt(p); setPf({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio.toString(), categoria: p.categoria, imagen: p.imagen || "", calificacion: p.calificacion }); setSpf(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => { if (confirm("Eliminar " + p.nombre + "?")) deleteProduct(p.id); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "usuarios" && (
          <div>
            <div className="relative mb-6 max-w-sm">
              <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
              <input type="text" value={su} onChange={e => setSu(e.target.value)} placeholder="Buscar usuario..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-light"><tr><th className="p-4 text-left font-bold text-gray-500">Usuario</th><th className="p-4 text-left font-bold text-gray-500">Email</th><th className="p-4 text-left font-bold text-gray-500">Rol</th><th className="p-4 text-right font-bold text-gray-500">Acciones</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-t border-gray-100 hover:bg-light/50">
                        <td className="p-4 flex items-center gap-3">
                          <img src={u.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&auto=format&fit=crop"} alt="" className="w-9 h-9 rounded-full object-cover" />
                          <span className="font-bold text-dark">{u.nombre}</span>
                        </td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4">
                          <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + (u.rol === "administrador" ? "bg-red-100 text-red-700" : u.rol === "cocinero" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700")}>{u.rol}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <select value={u.rol} onChange={e => editUserRole(u.id, e.target.value)}
                              className="p-2 bg-light rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary">
                              <option value="cliente">Cliente</option>
                              <option value="cocinero">Cocinero</option>
                              <option value="administrador">Admin</option>
                            </select>
                            <button onClick={() => { if (confirm("Eliminar " + u.nombre + "?")) deleteUser(u.id); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "reservas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.length === 0 ? <p className="text-gray-500 col-span-2 text-center py-10">No hay reservas</p> :
              reservations.map(r => (
                <div key={r.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-bold text-dark">{r.nombre}</p><p className="text-sm text-gray-500">{r.fecha} - {r.hora}</p></div>
                    <span className={"text-xs font-bold px-3 py-1 rounded-full " + (r.estado === "confirmada" ? "bg-green-100 text-green-700" : r.estado === "cancelada" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700")}>{r.estado}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{r.personas} persona(s) {r.comentarios ? "- " + r.comentarios : ""}</p>
                  <div className="flex gap-2">
                    {r.estado !== "confirmada" && <button onClick={() => updateReservationStatus(r.id, "confirmada")} className="px-4 py-2 text-xs font-bold bg-green-50 text-green-600 rounded-xl hover:bg-green-100">Confirmar</button>}
                    {r.estado !== "cancelada" && <button onClick={() => updateReservationStatus(r.id, "cancelada")} className="px-4 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-100">Cancelar</button>}
                    <button onClick={() => { if (confirm("Eliminar reserva?")) deleteReservation(r.id); }} className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">Eliminar</button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
