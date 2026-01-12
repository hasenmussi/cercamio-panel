import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Ticket, Calendar, Trash2, Tag } from 'lucide-react';
import CouponModal from '../components/CouponModal';

export default function Cupones() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/mi-negocio/cupones');
      setCoupons(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("¿Borrar este cupón?")) return;
    try {
        // Asumiendo que existe DELETE, si no, crearla o usar un PUT para desactivar
        await api.delete(`/mi-negocio/cupones/${id}`); 
        fetchCoupons();
    } catch(e) { alert("Error al borrar"); }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cupones de Descuento</h1>
          <p className="text-gray-500 text-sm">Gestiona tus campañas de marketing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition shadow-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          Crear Cupón
        </button>
      </div>

      {/* LISTA DE CUPONES */}
      {loading ? (
        <div className="p-10 text-center text-amber-500">Cargando tickets...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <CouponCard key={coupon.cupon_id} coupon={coupon} onDelete={() => handleDelete(coupon.cupon_id)} />
          ))}
          
          {coupons.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No hay cupones activos</p>
            </div>
          )}
        </div>
      )}

      <CouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={fetchCoupons} 
      />
    </div>
  );
}

function CouponCard({ coupon, onDelete }) {
  const isPercent = coupon.tipo_descuento === 'PORCENTAJE';
  
  // 🧠 LÓGICA DE FECHA ARGENTINA (DD/MM/YYYY)
  // El backend manda "25/12/2026". JS estándar espera "MM/DD/YYYY".
  // Tenemos que parsearlo manualmente para saber si venció.
  let isExpired = false;
  if (coupon.vencimiento_fmt) {
    const parts = coupon.vencimiento_fmt.split('/'); // ["25", "12", "2026"]
    if (parts.length === 3) {
      // new Date(año, mes-1, dia) -> Meses en JS van de 0 a 11
      const expiryDate = new Date(parts[2], parts[1] - 1, parts[0]);
      // Ponemos la fecha de hoy a las 00:00 para comparar peras con peras
      const today = new Date();
      today.setHours(0,0,0,0);
      
      isExpired = expiryDate < today;
    }
  }

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow
      ${isExpired ? 'opacity-60 grayscale' : ''}
    `}>
      {/* DECORACIÓN TICKET */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-100"></div>
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-100"></div>

      <div className="p-6 text-center border-b border-dashed border-gray-200">
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          {isPercent ? 'Descuento %' : 'Descuento $'}
        </span>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">
          {isPercent ? `${coupon.valor_descuento}%` : `$${coupon.valor_descuento}`}
        </h3>
        <p className="text-sm text-gray-500 font-medium">OFF</p>
      </div>

      <div className="p-4 bg-gray-50/50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-600 text-sm font-mono bg-white px-2 py-1 rounded border border-gray-200">
            <Tag className="w-3 h-3" />
            <span className="font-bold tracking-widest">{coupon.codigo}</span>
          </div>
          {/* Badge Vencido */}
          {isExpired && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">VENCIDO</span>}
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Ticket className="w-3 h-3" />
            <span>{coupon.stock_usado} / {coupon.stock_inicial} usados</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {/* 🔥 USAMOS EL CAMPO DEL BACKEND TAL CUAL VIENE */}
            <span>Vence: {coupon.vencimiento_fmt}</span>
          </div>
        </div>
      </div>

      {/* DELETE BUTTON */}
      <button 
        onClick={onDelete}
        className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
        title="Eliminar Cupón"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}