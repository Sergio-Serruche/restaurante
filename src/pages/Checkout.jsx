import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CreditCard, Banknote, QrCode, Check, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

const Checkout = () => {
  const { cartItems, subtotal, igv, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useApp();
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  const [direccion, setDireccion] = useState('');
  const [distrito, setDistrito] = useState('');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [metodoPago, setMetodoPago] = useState('Yape');
  const [yapeConfirmed, setYapeConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  if (cartItems.length === 0 && !completed) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display font-extrabold text-2xl text-dark mb-3">Carrito vacío</h2>
          <p className="text-gray-500 mb-6">Agrega productos al carrito primero</p>
          <button onClick={() => navigate('/menu')} className="px-6 py-3 bg-primary text-white font-bold rounded-xl">Ir al Menú</button>
        </div>
      </div>
    );
  }

  const handleConfirmPayment = () => {
    if (metodoPago === 'Yape' && !yapeConfirmed) { alert('Confirma el pago con Yape primero'); return; }
    const orderData = {
      userId: user?.id || 'guest',
      cliente: user?.nombre || 'Invitado',
      direccion, distrito, telefono, metodoPago,
      items: cartItems, subtotal, igv, total, estado: 'Pendiente'
    };
    const result = addOrder(orderData);
    if (result.success) { setOrderInfo(result.order); setCompleted(true); }
  };

  const generatePDF = async () => {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width);
      pdf.save('comprobante-' + orderInfo.id + '.pdf');
    } catch (err) {
      window.print();
    }
  };

  const finishOrder = () => { clearCart(); navigate('/historial'); };

  if (completed && orderInfo) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-light font-body">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="bg-green-100 p-3 rounded-full inline-flex mb-4"><Check className="h-10 w-10 text-green-600" /></div>
            <h1 className="font-display font-extrabold text-3xl text-dark">Pedido Confirmado!</h1>
            <p className="text-gray-500">Gracias por tu orden #{orderInfo.id}</p>
          </div>
          <div ref={receiptRef} className="bg-white rounded-3xl border border-gray-100 shadow-premium p-8 mb-6" style={{ fontFamily: 'monospace' }}>
            <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
              <h2 className="font-bold text-xl">Adriano's</h2>
              <p className="text-xs text-gray-500">Av. Larco 456, Miraflores, Lima</p>
              <p className="text-xs text-gray-500">RUC: 20567890321</p>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span><strong>Cliente:</strong> {orderInfo.cliente}</span>
              <span><strong>Fecha:</strong> {new Date(orderInfo.fecha).toLocaleDateString('es-PE')}</span>
            </div>
            <div className="text-sm mb-2"><strong>Dirección:</strong> {orderInfo.direccion}, {orderInfo.distrito}</div>
            <div className="text-sm mb-4"><strong>Método de pago:</strong> {orderInfo.metodoPago}</div>
            <table className="w-full text-sm mb-4">
              <thead><tr className="border-b border-gray-300"><th className="text-left py-1">Producto</th><th className="text-center py-1">Cant</th><th className="text-right py-1">Precio</th><th className="text-right py-1">Subtotal</th></tr></thead>
              <tbody>
                {orderInfo.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-1">{item.nombre}</td>
                    <td className="text-center py-1">{item.cantidad}</td>
                    <td className="text-right py-1">S/ {item.precio.toFixed(2)}</td>
                    <td className="text-right py-1">S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right space-y-1 text-sm border-t border-gray-300 pt-3">
              <p>Subtotal: S/ {orderInfo.subtotal.toFixed(2)}</p>
              <p>IGV (18%): S/ {orderInfo.igv.toFixed(2)}</p>
              <p className="font-bold text-lg">Total: S/ {orderInfo.total.toFixed(2)}</p>
            </div>
            <div className="text-center mt-6 border-t border-dashed border-gray-300 pt-4 text-xs text-gray-400">
              <p>Gracias por tu preferencia! Vuelve pronto.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={generatePDF} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-premium flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Descargar PDF</button>
            <button onClick={finishOrder} className="flex-1 py-3 bg-primary-orange text-white font-bold rounded-xl shadow-premium flex items-center justify-center gap-2">Ver Historial</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-extrabold text-3xl text-dark mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6 space-y-5">
              <h3 className="font-display font-bold text-lg">Dirección de Entrega</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Dirección</label>
                  <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required placeholder="Av. Larco 456" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Distrito</label>
                  <input type="text" value={distrito} onChange={(e) => setDistrito(e.target.value)} required placeholder="Miraflores" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Teléfono</label>
                  <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6 space-y-5">
              <h3 className="font-display font-bold text-lg">Método de Pago</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Yape', icon: QrCode, label: 'Yape' },
                  { id: 'Tarjeta', icon: CreditCard, label: 'Tarjeta' },
                  { id: 'Efectivo', icon: Banknote, label: 'Efectivo' },
                ].map((mp) => (
                  <button key={mp.id} onClick={() => { setMetodoPago(mp.id); setYapeConfirmed(false); }}
                    className={'p-4 rounded-2xl border-2 transition-all duration-200 text-center ' + (metodoPago === mp.id ? 'border-primary bg-red-50' : 'border-gray-200 hover:border-gray-300')}>
                    <mp.icon className={'h-6 w-6 mx-auto mb-1 ' + (metodoPago === mp.id ? 'text-primary' : 'text-gray-400')} />
                    <span className={'text-sm font-bold ' + (metodoPago === mp.id ? 'text-primary' : 'text-gray-600')}>{mp.label}</span>
                  </button>
                ))}
              </div>
              {metodoPago === 'Yape' && (
                <div className="bg-light p-5 rounded-2xl text-center">
                  <div className="bg-white p-4 rounded-2xl inline-block mb-3">
                    <QrCode className="h-32 w-32 text-dark" />
                  </div>
                  <p className="text-sm font-bold text-dark mb-2">Escanea el código QR con Yape</p>
                  <p className="text-xs text-gray-500 mb-3">O paga al número: 987 654 321</p>
                  <p className="font-bold text-lg text-dark mb-3">Total: S/ {total.toFixed(2)}</p>
                  <button onClick={() => setYapeConfirmed(!yapeConfirmed)}
                    className={'px-6 py-2.5 rounded-xl font-bold text-sm transition-all ' + (yapeConfirmed ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-2 border-green-600')}>
                    {yapeConfirmed ? 'Pago Confirmado' : 'Confirmar Pago'}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6 space-y-4">
              <h3 className="font-display font-bold text-lg border-b border-gray-100 pb-3">Resumen</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.imagen} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <p className="text-sm font-bold line-clamp-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500">{item.cantidad} x S/ {item.precio.toFixed(2)}</p>
                    </div>
                    <span className="text-sm font-bold">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>IGV (18%)</span><span>S/ {igv.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2"><span>Total</span><span className="text-primary">S/ {total.toFixed(2)}</span></div>
              </div>
              <button onClick={handleConfirmPayment} className="w-full py-3 bg-primary-orange hover:bg-primary-orange/95 text-white font-bold rounded-xl shadow-orange-premium transition-all duration-200">
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
