import { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, User, CheckCircle, Truck, Package, RefreshCw, Calendar, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/mi-negocio/ventas');
      // Aseguramos que sea un array
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const avanzarEstado = async (uuid, estadoActual, tipoEntrega) => {
    let nuevoEstado = '';
    
    if (estadoActual === 'APROBADO' || estadoActual === 'PENDIENTE_PAGO') {
      nuevoEstado = tipoEntrega === 'DELIVERY' ? 'EN_CAMINO' : 'LISTO';
    } else if (estadoActual === 'EN_CAMINO' || estadoActual === 'LISTO') {
      
      const codigo = prompt("Ingresa el CÓDIGO DE RETIRO del cliente:");
      if (!codigo) return; 
      
      try {
        await api.put('/mi-negocio/ventas/estado', { 
            compra_uuid: uuid, 
            nuevo_estado: 'ENTREGADO',
            codigo_input: codigo 
        });
        fetchOrders(); 
      } catch (err) {
        alert(err.response?.data?.error || "Código incorrecto");
      }
      return;
    } else {
      return; 
    }

    const backup = [...orders];
    setOrders(prev => prev.map(o => o.compra_uuid === uuid ? {...o, estado_global: nuevoEstado} : o));

    try {
      await api.put('/mi-negocio/ventas/estado', { 
          compra_uuid: uuid, 
          nuevo_estado: nuevoEstado 
      });
    } catch (error) {
      console.error(error);
      alert("Error al actualizar estado");
      setOrders(backup); 
    }
  };

  // Filtrado Seguro
  const colNuevos = orders.filter(o => ['APROBADO', 'PENDIENTE_PAGO'].includes(o.estado_global));
  const colEnCurso = orders.filter(o => ['EN_CAMINO', 'LISTO', 'PREPARANDO'].includes(o.estado_global));
  const colFinalizados = orders.filter(o => ['ENTREGADO'].includes(o.estado_global));

  if (loading) return <div className="p-10 text-center text-blue-600">Cargando comandas...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestor de Pedidos</h1>
          <p className="text-gray-500 text-sm">Arrastra o mueve los pedidos según su estado.</p>
        </div>
        <button onClick={fetchOrders} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn title="Nuevos / Pendientes" count={colNuevos.length} color="bg-blue-50 border-blue-100" icon={Clock} iconColor="text-blue-600">
          {colNuevos.map(order => <OrderCard key={order.compra_uuid} order={order} onAdvance={() => avanzarEstado(order.compra_uuid, order.estado_global, order.tipo_entrega)} />)}
        </KanbanColumn>

        <KanbanColumn title="En Preparación / Camino" count={colEnCurso.length} color="bg-orange-50 border-orange-100" icon={Truck} iconColor="text-orange-600">
          {colEnCurso.map(order => <OrderCard key={order.compra_uuid} order={order} onAdvance={() => avanzarEstado(order.compra_uuid, order.estado_global, order.tipo_entrega)} isProcess />)}
        </KanbanColumn>

        <KanbanColumn title="Finalizados (24h)" count={colFinalizados.length} color="bg-green-50 border-green-100" icon={CheckCircle} iconColor="text-green-600">
          {colFinalizados.map(order => <OrderCard key={order.compra_uuid} order={order} isDone />)}
        </KanbanColumn>
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, children, color, icon: Icon, iconColor }) {
  return (
    <div className={`min-w-[350px] w-[350px] flex flex-col rounded-xl border ${color} h-full`}>
      <div className="p-4 border-b border-gray-200/50 flex justify-between items-center bg-white/50 rounded-t-xl backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <span className="bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-600">{count}</span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
        {children}
        {count === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-gray-400 opacity-50 border-2 border-dashed border-gray-200 rounded-xl m-2">
            <Package className="w-8 h-8 mb-2" />
            <span className="text-sm">Sin pedidos</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 WIDGET BLINDADO CONTRA ERRORES
function OrderCard({ order, onAdvance, isProcess, isDone }) {
  // Helper moneda seguro
  const formatMoney = (val) => {
    try {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);
    } catch { return "$0.00"; }
  };
  
  // Helper fecha seguro
  const getTimeAgo = (dateString) => {
    try {
      if (!dateString) return "Hace un momento";
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
    } catch (e) {
      return "Fecha desconocida";
    }
  };

  // Validamos productos
  const productos = Array.isArray(order.productos) ? order.productos : [];
  
  // Detectar si es Agenda
  let fechaReservaStr = null;
  try {
    const pConFecha = productos.find(p => p.fecha_reserva_inicio != null);
    if (pConFecha) {
      const d = new Date(pConFecha.fecha_reserva_inicio);
      // Formato manual simple para no romper
      fechaReservaStr = `${d.getDate()}/${d.getMonth()+1} - ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}hs`;
    }
  } catch(e) { console.error(e); }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
      
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.tipo_entrega === 'DELIVERY' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3 pl-3">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">#{order.compra_uuid?.substring(0, 4).toUpperCase() || 'ID'}</h4>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeAgo(order.fecha)}</span>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
          ${order.tipo_entrega === 'DELIVERY' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
          {order.tipo_entrega || 'RETIRO'}
        </span>
      </div>

      {/* CLIENTE */}
      <div className="mb-3 pl-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-3 h-3 text-gray-500" />
        </div>
        <span className="text-sm font-medium text-gray-700 truncate">{order.comprador || 'Cliente Anónimo'}</span>
      </div>

      {/* PRODUCTOS */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-600 space-y-1 ml-3 border border-gray-100">
        {productos.map((p, i) => (
          <div key={i} className="flex justify-between">
            <span className="truncate w-3/4">
              <span className="font-bold text-gray-800">{p.cantidad}x</span> {p.nombre}
            </span>
          </div>
        ))}
        {productos.length === 0 && <span className="text-xs text-red-400">Error en datos de productos</span>}
        
        {/* FECHA RESERVA */}
        {fechaReservaStr && (
          <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-purple-700 font-bold">
            <Calendar className="w-4 h-4" />
            {fechaReservaStr}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center pl-3 pt-1">
        <span className="font-extrabold text-lg text-gray-900">{formatMoney(order.total_orden)}</span>
        
        {!isDone && (
          <button 
            onClick={onAdvance}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-transform active:scale-95 flex items-center gap-2
              ${isProcess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isProcess ? 'Finalizar' : (order.tipo_entrega === 'DELIVERY' ? 'Despachar' : 'Listo')}
            <span className="text-white/60">→</span>
          </button>
        )}
        
        {isDone && <span className="text-xs font-bold text-green-600 uppercase">Entregado</span>}
      </div>

    </div>
  );
}