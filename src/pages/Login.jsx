import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Store, ArrowRight, Loader2, AlertCircle, Lock, Mail, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirección si ya está logueado
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
      // 1. PETICIÓN LOGIN (Devuelve Token + Usuario + Perfiles)
      const response = await api.post('/auth/login', { email, password });
      
      const { token, usuario, perfil_profesional, perfil_socio } = response.data;

      // 🚨 BYPASS VIP PARA ADMIN (Entra sin perfiles)
      if (usuario.rol === 'SUPER_ADMIN' || usuario.rol === 'SOPORTE') {
         // Pasamos null en perfiles, el AdminLayout no los necesita
         login(token, usuario, null, null); 
         navigate('/', { replace: true });
         return; 
      }

      // 2. VALIDACIÓN DE ACCESO (Vendedor O Socio)
      // Si no tiene ninguno de los dos, es un comprador normal -> Bloqueamos acceso web.
      if (!perfil_profesional && !perfil_socio) {
        throw new Error("NO_ES_VENDEDOR_NI_SOCIO");
      }

      // 3. GUARDAR EN STORE Y ENTRAR
      // El store ahora acepta los 4 argumentos (token, user, local, socio)
      login(token, usuario, perfil_profesional, perfil_socio);
      
      // La App.jsx decidirá a dónde mandarlo (Dashboard o Selector)
      navigate('/', { replace: true });
      
    } catch (err) {
      console.error(err);
      if (err.message === "NO_ES_VENDEDOR_NI_SOCIO") {
        setError('Esta cuenta es de Comprador. Para usar el Panel Web debes tener una Tienda o ser Socio.');
      } else {
        // Mensaje genérico o el que venga del backend
        setError(err.response?.data?.error || 'Credenciales incorrectas o error de conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* 🖼️ SECCIÓN IZQUIERDA (BRANDING - SOLO DESKTOP/TABLET) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        
        {/* Fondos Abstractos Animados */}
        <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        
        {/* Contenido Hero */}
        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
            <Store className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight">
            El Sistema Operativo <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              de tu Negocio
            </span>
          </h2>
          
          <p className="text-slate-300 text-lg leading-relaxed">
            Gestiona tu inventario, controla tus ventas y conecta con tus vecinos en tiempo real. Todo desde un solo lugar.
          </p>

          {/* Badges Flotantes (Decoración) */}
          <div className="mt-12 flex justify-center gap-4 opacity-80">
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-white font-medium">
              🚀 Gestión en tiempo real
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-white font-medium">
              🛡️ Seguridad Total
            </div>
          </div>
        </div>
      </div>

      {/* 📝 SECCIÓN DERECHA (FORMULARIO) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Mobile (Solo visible si no hay panel izquierdo) */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido 👋</h1>
            <p className="mt-2 text-gray-500">Ingresa tus credenciales para acceder al panel.</p>
          </div>

          {/* Alerta de Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="ejemplo@cercamio.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:border-gray-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Botón de Acción */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar al Panel
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Footer Legal */}
          <p className="text-center text-xs text-gray-400 mt-8">
            &copy; 2026 CercaMío. Todos los derechos reservados.
            <br /> Acceso restringido a personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}