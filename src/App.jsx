import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Pedidos from './pages/Pedidos';
import Cupones from './pages/Cupones';

// 🛡️ COMPONENTE PROTECTOR (GUARDIA DE SEGURIDAD)
// Verifica si tienes token. 
// - Si NO tienes: Te manda al Login.
// - Si SÍ tienes: Te deja pasar y te envuelve en el MainLayout (Sidebar + Contenido).
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    // "replace" evita que el usuario pueda volver atrás con el botón del navegador
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
}

// 🧭 ENRUTADOR PRINCIPAL
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. RUTA PÚBLICA (La puerta de entrada) */}
        <Route path="/login" element={<Login />} />

        {/* 2. RUTAS PRIVADAS (El Panel de Control) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Inventario */}
        <Route path="/inventario" element={
          <ProtectedRoute>
            <Inventario />
          </ProtectedRoute>
        } />

        {/* Pedidos */}
        <Route path="/pedidos" element={
          <ProtectedRoute>
            <Pedidos />
          </ProtectedRoute>
        } />

        {/* Pedidos */}
        <Route path="/cupones" element={
          <ProtectedRoute>
            <Cupones />
          </ProtectedRoute>
        } />
        
        {/* 3. CATCH-ALL (Redirección por defecto) */}
        {/* Si escriben una url rara (/lo-que-sea), los mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;