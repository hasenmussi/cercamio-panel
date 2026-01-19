import { useEffect, useState } from 'react';
import { 
  Copy, CheckCircle, TrendingUp, Store, DollarSign, Users, AlertCircle, RefreshCw, Settings, X, Save 
} from 'lucide-react';
import api from '../../services/api';
import NivelesModal from '../../components/NivelesModal';

export default function DashboardSocio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ESTADOS INTERACTIVOS
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // ESTADO FORMULARIO PERFIL
  const [cbuEdit, setCbuEdit] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // TOAST (Mensaje flotante)
  const [toast, setToast] = useState(null);

  const [showNiveles, setShowNiveles] = useState(false);

  useEffect(() => {
    cargarDatosReales();
  }, []);

  // Función para mostrar mensajes temporales
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarDatosReales = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get('/socios/dashboard');
      setData(res.data);
      // Pre-cargar el CBU para el form de edición
      setCbuEdit(res.data.perfil.alias || '');
    } catch (error) {
      console.error("Error cargando dashboard socio:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const copyInvitation = () => {
    if (!data) return;
    const mensaje = `¡Hola! Te invito a sumarte a CercaMío, la app del barrio. 🏘️\n\nDescargala acá: https://cercamio.app\n\n🔑 Y usá mi código de socio: *${data.perfil.codigo}* para tener beneficios exclusivos.`;
    navigator.clipboard.writeText(mensaje);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- ACCIÓN DE RETIRO ---
  const handleWithdrawConfirm = async () => {
    try {
        await api.post('/socios/retirar');
        setShowWithdrawModal(false);
        showToast("Solicitud enviada con éxito 💸", 'success');
        cargarDatosReales(); // Recargar saldo
    } catch (e) {
        setShowWithdrawModal(false);
        showToast(e.response?.data?.error || "Error al retirar", 'error');
    }
  };

  // --- ACCIÓN DE GUARDAR PERFIL ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/socios/perfil', { cbu_alias: cbuEdit });
      setShowProfileModal(false);
      showToast("Datos bancarios actualizados", 'success');
      cargarDatosReales();
    } catch (e) {
      alert("Error: " + (e.response?.data?.error || "Intente luego"));
    } finally {
      setSavingProfile(false);
    }
  };

  const formatMoney = (val) => {
    if (!val) return "$0";
    const num = parseFloat(val);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-600 animate-pulse">Conectando con la base...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Error al cargar datos. <button onClick={cargarDatosReales} className="underline">Reintentar</button></div>;

  const { perfil, gamification, metricas, flota, retiros } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hola, Socio 👋</h1>
          <p className="text-gray-500 mt-1">Tu imperio comercial en tiempo real.</p>
        </div>
        
        <div className="flex gap-2">

            {/* BOTÓN NIVELES (TROFEO) */}
          <button 
            onClick={() => setShowNiveles(true)} 
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-500 transition"
            title="Ver Niveles y Comisiones"
          >
              <TrendingUp className="w-5 h-5" />
          </button>
          
          {/* BOTÓN REFRESH (ANIMADO) */}
          <button 
            onClick={cargarDatosReales} 
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition"
            title="Actualizar datos"
          >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
          
          {/* BOTÓN CONFIGURACIÓN (NUEVO) */}
          <button 
            onClick={() => setShowProfileModal(true)} 
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition"
            title="Configurar CBU"
          >
              <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 1. HERO CARD: MIS GANANCIAS */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 shadow-2xl shadow-emerald-200 text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
                <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider mb-2">Saldo Disponible</p>
                <h2 className="text-5xl font-black tracking-tight">{formatMoney(perfil.saldo)}</h2>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Nivel {gamification.nivel_actual} ({gamification.porcentaje_actual}%)</span>
                </div>
            </div>
            
            <button 
                onClick={() => {
                  if (parseFloat(perfil.saldo) <= 0) {
                    showToast("No tienes saldo para retirar", "error");
                  } else {
                    setShowWithdrawModal(true);
                  }
                }}
                className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all transform flex items-center gap-2"
            >
                <DollarSign className="w-5 h-5" />
                SOLICITAR RETIRO
            </button>
        </div>
      </div>

      {/* 2. CÓDIGO DE RECLUTAMIENTO */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
         <div className="p-4 bg-blue-50 rounded-full text-blue-600">
             <Users className="w-8 h-8" />
         </div>
         <div className="flex-1 text-center md:text-left">
             <h3 className="font-bold text-gray-900 text-lg">Tu Código de Agente</h3>
             <p className="text-gray-500 text-sm">Dile a los comercios que ingresen este código al registrarse en la App.</p>
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="bg-slate-100 px-6 py-3 rounded-lg font-mono text-slate-800 text-xl font-black tracking-widest border border-slate-200">
                 {perfil.codigo}
             </div>
             <button 
                onClick={copyInvitation}
                className={`p-3 rounded-lg transition-all flex items-center gap-2 font-bold text-sm px-4
                    ${copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
             >
                 {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copied ? "COPIADO" : "COPIAR INVITACIÓN"}
             </button>
         </div>
      </div>

      {/* 3. MI FLOTA (TABLA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-6">
              <StatTile icon={Store} label="Locales Totales" value={metricas.total_locales} color="blue" />
              <StatTile icon={TrendingUp} label="Locales Activos" value={metricas.locales_activos} color="purple" />
              
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white">
                 <p className="text-xs font-bold uppercase tracking-wider text-amber-100">Próximo Nivel</p>
                 <h3 className="text-2xl font-black mt-1">{gamification.nivel_siguiente}</h3>
                 <p className="text-sm mt-2 font-medium opacity-90">{gamification.mensaje}</p>
                 <div className="w-full bg-black/20 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${parseFloat(gamification.progreso_decimal) * 100}%` }}></div>
                 </div>
              </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Mi Flota de Comercios</h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">{flota.length} Registrados</span>
              </div>
              
              {flota.length === 0 ? (
                 <div className="p-10 text-center text-gray-400">
                    <Store className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Aún no tienes comercios. ¡Sal a reclutar!</p>
                 </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-gray-500 font-medium sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3">Local</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Ventas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {flota.map((local, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={local.foto_url || "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"} className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                                            <span className="font-bold text-gray-800">{local.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {parseInt(local.total_ventas_historicas) > 0
                                            ? <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-3 h-3" /> Vendiendo</span>
                                            : <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded"><AlertCircle className="w-3 h-3" /> Pendiente</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                                        {local.total_ventas_historicas}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              )}
          </div>
      </div>
      
      {/* HISTORIAL RETIROS */}
      {retiros && retiros.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Últimos Retiros</h3>
              <div className="space-y-3">
                  {retiros.map((r, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${r.estado === 'PAGADO' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                  <DollarSign className="w-4 h-4" />
                              </div>
                              <div>
                                  <p className="font-bold text-sm text-gray-800">Retiro de Fondos</p>
                                  <p className="text-xs text-gray-500">{r.fecha}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-gray-900">- {formatMoney(r.monto)}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.estado === 'PAGADO' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>{r.estado}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- MODALES --- */}

      {/* 1. MODAL RETIRO (Glass) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
             <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <DollarSign className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Solicitar Retiro</h2>
                <p className="text-gray-500 mt-2">Vas a retirar <span className="font-bold text-green-600">{formatMoney(perfil.saldo)}</span></p>
                
                <div className="bg-gray-50 p-4 rounded-xl mt-6 border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase">Se enviará a:</p>
                   <p className="text-lg font-mono font-bold text-gray-800 break-all">{perfil.alias || 'SIN CBU DEFINIDO'}</p>
                </div>

                <div className="flex gap-3 mt-8">
                   <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition">Cancelar</button>
                   <button onClick={handleWithdrawConfirm} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition">Confirmar</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 2. MODAL PERFIL (CBU) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mis Datos Bancarios</h2>
                <button onClick={() => setShowProfileModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
             </div>
             
             <form onSubmit={handleSaveProfile}>
                <label className="block text-sm font-bold text-gray-700 mb-2">CBU / Alias (Mercado Pago o Banco)</label>
                <input 
                  type="text" 
                  value={cbuEdit} 
                  onChange={(e) => setCbuEdit(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Ej: mi.alias.mp"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">Aquí es donde te enviaremos tus comisiones.</p>

                <button type="submit" disabled={savingProfile} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
                   {savingProfile ? 'Guardando...' : <><Save className="w-4 h-4"/> Guardar Cambios</>}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* 3. MODAL NIVELES (PEGAR AQUÍ) 🏆 */}
      <NivelesModal 
        isOpen={showNiveles} 
        onClose={() => setShowNiveles(false)} 
        currentLevel={gamification.nivel_actual} 
      />

      {/* 3. TOAST NOTIFICATION (Abajo derecha) */}
      {toast && (
         <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50
            ${toast.type === 'error' ? 'bg-red-500' : 'bg-gray-900'}
         `}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-white" />}
            {toast.msg}
         </div>
      )}

    </div>
  );
}

// Widget Stat
function StatTile({ icon: Icon, label, value, color }) {
    const colorMap = {
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600"
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${colorMap[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}