import { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  Users, Store, TrendingUp, DollarSign, Activity, 
  ArrowUpRight, Calendar, Globe 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos reales del endpoint que creamos
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper Moneda
  const formatMoney = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-cyan-500">
      <Activity className="w-10 h-10 animate-pulse" />
    </div>
  );

  const { kpis, chart, lastUsers } = data || { kpis: {}, chart: [], lastUsers: [] };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER DE PODER */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
              EN VIVO
            </span>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">System Status: Online</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Torre de Control 🗼</h1>
          <p className="text-slate-400 mt-1">Visión global del ecosistema CercaMío.</p>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase">Hora del Servidor</p>
            <p className="text-xl font-mono text-cyan-400">{new Date().toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
      </div>

      {/* KPIS DE NEÓN (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeonCard 
          title="Usuarios Totales" 
          value={kpis.total_usuarios} 
          icon={Users} 
          color="cyan" 
          trend="+5 hoy"
        />
        <NeonCard 
          title="Locales Activos" 
          value={kpis.total_locales} 
          icon={Store} 
          color="violet" 
          trend="Estable"
        />
        <NeonCard 
          title="Ventas Hoy" 
          value={kpis.ventas_hoy} 
          icon={Activity} 
          color="amber" 
          trend="En tiempo real"
        />
        <NeonCard 
          title="Volumen Total (GMV)" 
          value={formatMoney(kpis.gmv_total)} 
          icon={DollarSign} 
          color="emerald" 
          isMoney
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRÁFICO PRINCIPAL (DARK MODE) */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Tendencia de Ingresos
            </h3>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1 outline-none">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="fecha" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
                  itemStyle={{color: '#22d3ee'}}
                  formatter={(value) => [formatMoney(value), "Volumen"]}
                />
                <Area type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FEED DE ACTIVIDAD (ÚLTIMOS USUARIOS) */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-violet-400" />
            Nuevos Ciudadanos
          </h3>
          <div className="space-y-4">
            {lastUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors cursor-default group">
                <img 
                  src={u.foto_url || `https://ui-avatars.com/api/?name=${u.nombre_completo}&background=random`} 
                  className="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-violet-500 transition-colors"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-200 truncate">{u.nombre_completo}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="ml-auto text-xs text-emerald-400 font-mono bg-emerald-400/10 px-2 py-1 rounded">
                  NUEVO
                </div>
              </div>
            ))}
            {lastUsers.length === 0 && <p className="text-slate-500 text-sm">Sin usuarios recientes.</p>}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 rounded-lg transition-all">
            Ver Todos los Usuarios
          </button>
        </div>

      </div>
    </div>
  );
}

// ✨ COMPONENTE: TARJETA NEÓN DE ALTO IMPACTO
function NeonCard({ title, value, icon: Icon, color, trend, isMoney }) {
  // Mapa de colores Tailwind para safelist dinámico (o lógica simple)
  const colorMap = {
    cyan: 'text-cyan-400 from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 shadow-cyan-500/10',
    violet: 'text-violet-400 from-violet-500/20 to-violet-500/5 border-violet-500/20 shadow-violet-500/10',
    amber: 'text-amber-400 from-amber-500/20 to-amber-500/5 border-amber-500/20 shadow-amber-500/10',
    emerald: 'text-emerald-400 from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 shadow-emerald-500/10',
  };

  const theme = colorMap[color];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${theme.split(' ')[1]} ${theme.split(' ')[2]} border ${theme.split(' ')[3]} rounded-2xl p-6 shadow-lg ${theme.split(' ')[4]} transition-transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <h3 className={`text-3xl font-black text-white ${isMoney ? 'tracking-tight' : ''}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/5`}>
          <Icon className={`w-6 h-6 ${theme.split(' ')[0]}`} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold">{trend}</span>
          <span className="text-slate-500 text-xs ml-1">vs ayer</span>
        </div>
      )}

      {/* EFECTO DE RESPLANDOR DE FONDO */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color}-500/20 blur-[50px] rounded-full pointer-events-none`}></div>
    </div>
  );
}