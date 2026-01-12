import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Plus, Filter, Package, AlertCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import ProductModal from '../components/ProductModal'; // 👈 IMPORTANTE

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ESTADOS DEL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mi-negocio/productos');
      const lista = res.data.items || res.data || [];
      setProducts(lista);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ACCIONES ---
  const handleOpenCreate = () => {
    setProductToEdit(null); // Limpiamos para crear
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product); // Cargamos datos para editar
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto? No se puede deshacer.")) return;

    try {
      await api.delete(`/mi-negocio/eliminar/${id}`);
      fetchProducts(); // Recargar tabla
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  // Helper Moneda ARS
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);
  };

  // Filtrado
  const filteredProducts = products.filter(p => 
    p.nombre_oficial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-500 text-sm">Gestioná tus productos y precios.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
          <button 
            onClick={handleOpenCreate} // 🔥 ABRIR MODAL
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 hidden md:block">
          Mostrando <span className="font-bold text-gray-900">{filteredProducts.length}</span> productos
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center text-blue-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => {
                  const isLowStock = product.stock < 5;
                  const isService = product.tipo_item === 'SERVICIO';

                  return (
                    <tr key={product.inventario_id} className="hover:bg-gray-50/50 transition-colors group">
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                            {product.foto_url ? (
                              <img src={product.foto_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.nombre_oficial}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{product.descripcion || 'Sin descripción'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${product.categoria_interna === 'OFERTA_FLASH' ? 'bg-red-100 text-red-800' : 
                            product.categoria_interna === 'OFERTA_ESPECIAL' ? 'bg-amber-100 text-amber-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {product.categoria_interna === 'GENERAL' ? 'General' : 
                           product.categoria_interna === 'OFERTA_FLASH' ? 'Flash 🔥' : 'Oferta'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{formatMoney(product.precio)}</div>
                      </td>

                      <td className="px-6 py-4">
                        {isService ? (
                           <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Agenda</span>
                        ) : (
                          <div className={`flex items-center gap-2 ${isLowStock ? 'text-red-600' : 'text-gray-600'}`}>
                            {isLowStock && <AlertCircle className="w-4 h-4" />}
                            <span className="font-medium">{product.stock} un.</span>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(product)} // 🔥 EDITAR
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.inventario_id)} // 🔥 ELIMINAR
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No se encontraron productos.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Mostrando {filteredProducts.length} resultados</span>
        </div>
      </div>

      {/* MODAL COMPONENT (HIDDEN BY DEFAULT) */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onProductSaved={fetchProducts} // Recarga la tabla al guardar
      />

    </div>
  );
}