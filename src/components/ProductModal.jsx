import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Save, DollarSign, Package, FileText, Tag, Barcode } from 'lucide-react';
import api from '../services/api';

export default function ProductModal({ isOpen, onClose, productToEdit, onProductSaved }) {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    codigo_barras: '',
    foto_url: null
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre_oficial,
        descripcion: productToEdit.descripcion || '',
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        codigo_barras: productToEdit.codigo_barras || '',
        foto_url: productToEdit.foto_url
      });
    } else {
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', codigo_barras: '', foto_url: null });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const data = new FormData();
    data.append('imagen', file);

    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, foto_url: res.data.url }));
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        foto_url: formData.foto_url,
        codigo_barras: formData.codigo_barras,
        tipo_item: 'PRODUCTO_STOCK',
        stock_inicial: parseInt(formData.stock)
      };

      if (productToEdit) {
        await api.put('/mi-negocio/actualizar', {
          ...payload,
          inventario_id: productToEdit.inventario_id,
          nuevo_nombre: payload.nombre,
          nuevo_precio: payload.precio,
          nuevo_stock: payload.stock,
          nuevo_desc: payload.descripcion,
          nuevo_foto: payload.foto_url
        });
      } else {
        await api.post('/mi-negocio/crear-item', payload);
      }

      onProductSaved();
      onClose();

    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* CARD PRINCIPAL */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        
        {/* HEADER CON GRADIENTE SUTIL */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
              {productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Completa la información para tu catálogo</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* ZONA DE IMAGEN (HERO) */}
            <div className="flex justify-center">
              <div className="relative group w-full max-w-sm h-48">
                <div className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300
                  ${formData.foto_url 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-gray-50/50'}`}>
                  
                  {formData.foto_url ? (
                    <div className="relative w-full h-full">
                      <img src={formData.foto_url} alt="Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Cambiar imagen
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 block">Sube una foto del producto</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG o WebP</span>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                  />
                  
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GRILLA DE INPUTS PRO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* NOMBRE */}
              <div className="col-span-2 group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre del Producto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    required 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium" 
                    placeholder="Ej: Coca Cola 1.5L" 
                  />
                </div>
              </div>

              {/* PRECIO */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Precio ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input 
                    required 
                    type="number" 
                    name="precio" 
                    value={formData.precio} 
                    onChange={handleChange} 
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all font-bold text-lg" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              {/* STOCK */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Stock Inicial</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input 
                    required 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all font-medium" 
                    placeholder="0" 
                  />
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="col-span-2 group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Descripción</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <textarea 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all h-24 resize-none" 
                    placeholder="Detalles del producto (opcional)..." 
                  />
                </div>
              </div>

              {/* CÓDIGO BARRAS */}
              <div className="col-span-2 group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Código de Barras</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Barcode className="h-5 w-5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
                  </div>
                  <input 
                    name="codigo_barras" 
                    value={formData.codigo_barras} 
                    onChange={handleChange} 
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 focus:bg-white transition-all font-mono tracking-wider" 
                    placeholder="EAN / UPC (Opcional)" 
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="productForm"
            disabled={isLoading}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>

      </div>
    </div>
  );
}