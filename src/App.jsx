import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// LAYOUTS
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout'; // 👈 FALTABA ESTO

// PAGINAS PÚBLICAS/VENDEDOR
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos'; // Asegúrate de tener este archivo si lo usas
import Cupones from './pages/Cupones'; // Asegúrate de tener este archivo si lo usas

// PAGINAS ADMIN
import AdminDashboard from './pages/admin/AdminDashboard'; // 👈 FALTABA ESTO
import UsuariosAdmin from './pages/admin/UsuariosAdmin';
import FinanzasAdmin from './pages/admin/FinanzasAdmin';
import MapaAdmin from './pages/admin/MapaAdmin';
import SeguridadAdmin from './pages/admin/SeguridadAdmin';

// 🛡️ PROTECTOR DE RUTA (VENDEDOR)
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
}

// 🧭 ENRUTADOR PRINCIPAL
function App() {
  const user = useAuthStore((state) => state.user);
  
  // Detectamos si es Admin (Rol viene del backend en el login)
  const esAdmin = user?.rol === 'SUPER_ADMIN' || user?.rol === 'SOPORTE';

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 2. MUNDO ADMIN (Solo si esAdmin es true) */}
        {esAdmin && (
          <Route path="/" element={<AdminLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
             <Route path="/admin/finanzas" element={<FinanzasAdmin />} />
             <Route path="/admin/mapa" element={<MapaAdmin />} />
             <Route path="/admin/seguridad" element={<SeguridadAdmin />} />
          </Route>
        )}

        {/* 3. MUNDO VENDEDOR (Si NO es admin) */}
        {!esAdmin && (
          <>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
            <Route path="/cupones" element={<ProtectedRoute><Cupones /></ProtectedRoute>} />
          </>
        )}
        
        {/* 4. CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;