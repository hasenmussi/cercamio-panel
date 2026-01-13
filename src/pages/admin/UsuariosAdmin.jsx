import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Search, Ban, CheckCircle, Shield, Store, User, Loader2 } from 'lucide-react';

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounce manual simple para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async (search = '') => {
    try {
      const res = await api.get(`/admin/usuarios?search=${search}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id) => {
    if(!confirm("¿Seguro que quieres cambiar el estado de acceso de este usuario?")) return;
    
    // Optimistic UI
    setUsers(prev => prev.map(u => u.usuario_id === id ? { ...u, activo: !u.activo } : u));

    try {
      await api.put(`/admin/usuarios/${id}/ban`);
    } catch (error) {
      alert("Error al cambiar estado");
      fetchUsers(searchTerm); // Revertir
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Ciudadanos</h1>
          <p className="text-slate-400 text-sm">Gestión de usuarios y permisos.</p>
        </div>
        
        {/* BUSCADOR NEÓN */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DARK MODE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol / Tipo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-cyan-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.usuario_id} className="hover:bg-slate-800/50 transition-colors group">
                  
                  {/* USUARIO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.foto_url || `https://ui-avatars.com/api/?name=${user.nombre_completo}&background=random`} 
                        className="w-10 h-10 rounded-full border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{user.nombre_completo}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* ROL */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.rol === 'SUPER_ADMIN' && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Shield className="w-3 h-3 mr-1" /> GOD
                        </span>
                      )}
                      {user.tipo === 'PROFESIONAL' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Store className="w-3 h-3 mr-1" /> Vendedor
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <User className="w-3 h-3 mr-1" /> Vecino
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    {user.activo ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> ACTIVO
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                        <Ban className="w-3 h-3" /> BLOQUEADO
                      </span>
                    )}
                  </td>

                  {/* FECHA */}
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {user.fecha_registro || '--/--/----'}
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4 text-right">
                    {user.rol !== 'SUPER_ADMIN' && (
                      <button 
                        onClick={() => toggleBan(user.usuario_id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.activo 
                            ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' 
                            : 'text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                        title={user.activo ? "Bloquear Acceso" : "Restaurar Acceso"}
                      >
                        {user.activo ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && !loading && (
            <div className="p-10 text-center text-slate-500">
              No se encontraron usuarios.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}