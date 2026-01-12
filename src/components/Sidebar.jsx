import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const local = useAuthStore((state) => state.local);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel Principal', to: '/' },
    { icon: Package, label: 'Inventario', to: '/inventario' },
    { icon: ShoppingBag, label: 'Pedidos', to: '/pedidos' },
    { icon: Ticket, label: 'Cupones', to: '/cupones' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-10">
      
      {/* LOGO AREA */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <Store className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg leading-none">CercaMío</h1>
          <span className="text-xs text-blue-600 font-medium">Panel Vendedor</span>
        </div>
      </div>

      {/* PERFIL LOCAL */}
      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <img 
            src={local?.foto_perfil || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} 
            alt="Logo Local" 
            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{local?.nombre || "Mi Local"}</p>
            <p className="text-xs text-gray-500 truncate">{local?.rubro || "Comercio"}</p>
          </div>
        </div>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}