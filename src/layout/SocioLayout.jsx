import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, LogOut, Users, Wallet, ArrowLeft, Megaphone } from 'lucide-react';

export default function SocioLayout({ children }) {
  const { logout, local } = useAuthStore();
  const navigate = useNavigate();

  // Si tiene local, mostramos botón para volver al selector o cambiar de modo
  const tieneDobleRol = !!local; 

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* SIDEBAR VERDE */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
        
        {/* LOGO */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-emerald-200">
            <Users className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-gray-800 text-lg leading-none">SOCIOS</h1>
            <span className="text-xs text-emerald-600 font-bold tracking-wider">EARN & GROW</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          
          {/* BOTÓN DASHBOARD */}
          <NavLink 
            to="/socio" 
            end 
            className={({isActive}) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all 
              ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}
            `}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>

          {/* BOTÓN KIT MARKETING (CORREGIDO) */}
          <NavLink 
            to="/socio/marketing" 
            className={({isActive}) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all 
              ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}
            `}
          >
            <Megaphone className="w-5 h-5" /> Kit Marketing
          </NavLink>

        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {tieneDobleRol && (
            <button onClick={() => navigate('/seleccion')} className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> Cambiar Modo
            </button>
          )}
          <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}