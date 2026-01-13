import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 IMPORTANTE
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Store, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // 👈 Hook de navegación
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 🔄 EFECTO DE REDIRECCIÓN AUTOMÁTICA
  // Si el usuario ya está logueado, no debería ver el Login, lo mandamos al Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. LOGIN NORMAL (Obtener Token y Datos)
      const resLogin = await api.post('/auth/login', { email, password });
      const { token, usuario } = resLogin.data;

      // 🚨 BYPASS VIP PARA SUPER ADMIN 🚨
      // Si es Admin, no le pedimos que tenga un Kiosco. Entra directo.
      if (usuario.rol === 'SUPER_ADMIN' || usuario.rol === 'SOPORTE') {
         login(token, usuario, null); // Pasamos null en 'local' porque no tiene
         navigate('/', { replace: true });
         return; // 🛑 Detenemos la función aquí, éxito total.
      }

      // 2. VERIFICACIÓN DE NEGOCIO (Solo para usuarios normales)
      try {
        const resLocal = await api.get('/mi-negocio/config', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const localData = resLocal.data;

        // 3. GUARDAR EN STORE (Vendedor)
        login(token, usuario, localData);
        navigate('/', { replace: true });

      } catch (errLocal) {
        console.warn("Usuario sin local intentando entrar al panel");
        throw new Error("NO_ES_VENDEDOR");
      }
      
    } catch (err) {
      console.error(err);
      if (err.message === "NO_ES_VENDEDOR") {
        setError('Esta cuenta no tiene una tienda activa. Crea tu comercio desde la App móvil.');
      } else {
        setError('Credenciales incorrectas o error de conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Vendedores</h1>
          <p className="text-gray-500 text-sm mt-2">Gestioná tu negocio en CercaMío</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-red-600 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Ingresando...
              </>
            ) : (
              <>
                Ingresar al Panel
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            CercaMío Web OS v1.0 • Titanium Elite
          </p>
        </div>
      </div>
    </div>
  );
}