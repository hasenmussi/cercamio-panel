import { useNavigate } from 'react-router-dom';
import { Store, Users, ArrowRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function SeleccionRol() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const local = useAuthStore((state) => state.local);
  const socio = useAuthStore((state) => state.socio);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Hola, {user?.nombre?.split(' ')[0]} 👋</h1>
          <p className="text-slate-500">¿A dónde quieres ir hoy?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TARJETA VENDEDOR */}
          <div 
            onClick={() => navigate('/vendedor')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Store className="w-32 h-32 text-blue-600" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <Store className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Mi Negocio</h2>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Gestiona tu inventario, turnos, pedidos y cupones.
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                Entrar al Panel <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

          {/* TARJETA SOCIO */}
          <div 
            onClick={() => navigate('/socio')}
            className="group relative bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-green-400 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-32 h-32 text-green-400" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Panel de Socio</h2>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                Revisa tus comisiones, locales reclutados y solicita retiros.
              </p>
              <div className="flex items-center text-green-400 font-bold group-hover:translate-x-2 transition-transform">
                Ver Ganancias <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 text-center">
          <button onClick={logout} className="text-slate-400 hover:text-red-500 flex items-center gap-2 mx-auto transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}