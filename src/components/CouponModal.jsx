import { useState } from 'react';
import { X, Loader2, Save, Ticket, Percent, Calendar, Layers } from 'lucide-react';
import api from '../services/api';

export default function CouponModal({ isOpen, onClose, onSaved }) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    tipo_descuento: 'PORCENTAJE', // Default
    valor_descuento: '',
    stock: '',
    dias_duracion: '7' // Duración por defecto en días
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculamos la fecha de vencimiento basada en los días elegidos
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + parseInt(formData.dias_duracion));

      await api.post('/mi-negocio/cupones', {
        codigo: formData.codigo.toUpperCase(),
        descripcion: formData.descripcion,
        tipo_descuento: formData.tipo_descuento,
        valor_descuento: parseFloat(formData.valor_descuento),
        stock: parseInt(formData.stock),
        fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0] // YYYY-MM-DD
      });

      onSaved();
      onClose();
    } catch (error) {
      console.error("Error creando cupón:", error);
      alert("Error al crear el cupón. Verifica los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
        
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
          <div>
            <h2 className="text-xl font-extrabold text-amber-900 tracking-tight">Nuevo Cupón 🎟️</h2>
            <p className="text-xs text-amber-600 font-medium mt-1">Crea una promoción para atraer clientes</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form id="couponForm" onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* CÓDIGO (HERO INPUT) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código del Cupón</label>
            <div className="relative">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 w-6 h-6" />
              <input 
                required 
                name="codigo"
                value={formData.codigo} 
                onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})} // Force Uppercase
                className="w-full pl-12 pr-4 py-4 bg-amber-50 border-2 border-amber-100 rounded-xl text-2xl font-black text-amber-900 placeholder-amber-200/50 focus:outline-none focus:border-amber-400 transition-all uppercase tracking-widest text-center" 
                placeholder="VERANO2026" 
                maxLength={15}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* TIPO */}
            <div>
              <label className="label-text">Tipo de Descuento</label>
              <select name="tipo_descuento" value={formData.tipo_descuento} onChange={handleChange} className="input-field">
                <option value="PORCENTAJE">% Porcentaje</option>
                <option value="FIJO">$ Monto Fijo</option>
              </select>
            </div>

            {/* VALOR */}
            <div>
              <label className="label-text">Valor ({formData.tipo_descuento === 'PORCENTAJE' ? '%' : '$'})</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input required type="number" name="valor_descuento" value={formData.valor_descuento} onChange={handleChange} className="input-field pl-9 font-bold" placeholder="20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* STOCK */}
            <div>
              <label className="label-text">Cantidad Disponible</label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="input-field pl-9" placeholder="100" />
              </div>
            </div>

            {/* DURACIÓN */}
            <div>
              <label className="label-text">Duración (Días)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input required type="number" name="dias_duracion" value={formData.dias_duracion} onChange={handleChange} className="input-field pl-9" placeholder="7" />
              </div>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="label-text">Descripción (Opcional)</label>
            <input name="descripcion" value={formData.descripcion} onChange={handleChange} className="input-field" placeholder="Ej: Válido solo en efectivo" />
          </div>

        </form>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" form="couponForm" disabled={isLoading} className="btn-primary bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Crear Cupón
          </button>
        </div>

      </div>
      <style>{`
        .label-text { @apply block text-xs font-bold text-gray-600 mb-1.5 uppercase; }
        .input-field { @apply w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all; }
        .btn-primary { @apply px-6 py-2.5 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50; }
        .btn-secondary { @apply px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition; }
      `}</style>
    </div>
  );
}