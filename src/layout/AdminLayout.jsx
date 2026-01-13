import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Map, 
  ShieldAlert, 
  LogOut, 
  Globe 
} from 'lucide-react';

export default function AdminLayout() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenu = [
    { icon: LayoutDashboard, label: 'Torre de Control', to: '/' },
    { icon: DollarSign, label: 'Finanzas & Revenue', to: '/admin/finanzas' },
    { icon: Users, label: 'Usuarios & Locales', to: '/admin/usuarios' },
    { icon: Map, label: 'Geo-Analytics', to: '/admin/mapa' },
    { icon: ShieldAlert, label: 'Seguridad & Logs', to: '/admin/seguridad' },
  ];

  return (
    // Esto pone todo el fondo en modo "Torre de Control Nocturna"
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      
      {/* 🌑 SIDEBAR OSCURO (EXCLUSIVO ADMIN) */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-2xl">
        
        {/* HEADER */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">CercaMío</h1>
              <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-cyan-400 uppercase tracking-widest border border-slate-700">
                God Mode
              </span>
            </div>
          </div>
        </div>

        {/* USER INFO */}
        <div className="p-6 border-b border-slate-800 bg-slate-800/30">
          <div className="flex items-center gap-4">
            <img 
              src={user?.foto_url || "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"} 
              alt="Admin" 
              className="w-12 h-12 rounded-full border-2 border-cyan-500 p-0.5"
            />
            <div>
              <p className="font-bold text-sm text-slate-200">{user?.nombre || 'Super Admin'}</p>
              <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plataforma</p>
          {adminMenu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors ${ ({ isActive }) => isActive ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ☀️ CONTENT AREA (MAIN) */}
      <main className="flex-1 ml-72 p-8">
        {/* Renderiza las páginas hijas aquí */}
        <Outlet /> 
      </main>

    </div>
  );
}