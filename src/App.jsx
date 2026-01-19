import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// LAYOUTS
import MainLayout from './layout/MainLayout';     // Layout Vendedor (Azul)
import AdminLayout from './layout/AdminLayout';   // Layout Admin (Oscuro)
import SocioLayout from './layout/SocioLayout';   // Layout Socio (Verde/Nuevo)

// PÁGINAS COMUNES
import Login from './pages/Login';
import SeleccionRol from './pages/SeleccionRol';

// PÁGINAS VENDEDOR
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import Cupones from './pages/Cupones';

// PÁGINAS ADMIN
import AdminDashboard from './pages/admin/AdminDashboard';
import FinanzasAdmin from './pages/admin/FinanzasAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import MapaAdmin from './pages/admin/MapaAdmin';
import SeguridadAdmin from './pages/admin/SeguridadAdmin';

// PÁGINAS SOCIO
import DashboardSocio from './pages/socio/DashboardSocio';
import MarketingSocio from './pages/socio/MarketingSocio';

// 🛡️ COMPONENTE: REDIRECTOR INTELIGENTE
function RootRedirector() {
  const { user, local, socio, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 1. SUPER ADMIN
  if (user?.rol === 'SUPER_ADMIN' || user?.rol === 'SOPORTE') {
     return <Navigate to="/admin" replace />;
  }

  // 2. MULTI-ROL (TIENE AMBOS)
  if (local && socio) {
     return <Navigate to="/seleccion" replace />;
  }

  // 3. SOLO VENDEDOR
  if (local) {
     return <Navigate to="/vendedor" replace />;
  }

  // 4. SOLO SOCIO
  if (socio) {
     return <Navigate to="/socio" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
}

// 🛡️ PROTECTOR DE RUTA GENÉRICO
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.rol === 'SUPER_ADMIN' || user?.rol === 'SOPORTE';

  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* ROOT: DECIDE A DÓNDE IR */}
        <Route path="/" element={<RootRedirector />} />
        
        {/* INTERMEDIA: SELECCIÓN */}
        <Route path="/seleccion" element={<ProtectedRoute><SeleccionRol /></ProtectedRoute>} />

        {/* 🌍 ZONA ADMIN */}
        {esAdmin && (
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
             <Route path="/admin/finanzas" element={<FinanzasAdmin />} />
             <Route path="/admin/mapa" element={<MapaAdmin />} />
             <Route path="/admin/seguridad" element={<SeguridadAdmin />} />
          </Route>
        )}

        {/* 🏪 ZONA VENDEDOR */}
        <Route path="/vendedor" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/vendedor/inventario" element={<ProtectedRoute><MainLayout><Inventario /></MainLayout></ProtectedRoute>} />
        <Route path="/vendedor/pedidos" element={<ProtectedRoute><MainLayout><Pedidos /></MainLayout></ProtectedRoute>} />
        <Route path="/vendedor/cupones" element={<ProtectedRoute><MainLayout><Cupones /></MainLayout></ProtectedRoute>} />

        {/* 🤝 ZONA SOCIO (NUEVA) */}
        <Route path="/socio" element={<ProtectedRoute><SocioLayout><DashboardSocio /></SocioLayout></ProtectedRoute>} />
        <Route path="/socio/marketing" element={<ProtectedRoute><SocioLayout><MarketingSocio /></SocioLayout></ProtectedRoute>} />
        
        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;