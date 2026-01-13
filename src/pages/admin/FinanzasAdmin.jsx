import { useEffect, useState } from 'react';
import api from '../../services/api';
import { DollarSign, CreditCard, ShoppingBag, Users, ArrowUpRight, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function FinanzasAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanzas();
  }, []);

  const fetchFinanzas = async () => {
    try {
      const res = await api.get('/admin/finanzas');
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Formateador
  const formatMoney = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val || 0);

  if (loading) return <div className="p-20 text-center text-cyan-500 animate-pulse">Calculando Riqueza...</div>;
  if (!data) return <div className="p-20 text-center text-red-500">Error de carga</div>;

  // Datos para el Gráfico de Torta
  const pieData = [
    { name: 'Comisiones Ventas', value: parseFloat(data.revenue_mkp), color: '#3b82f6' }, // Blue
    { name: 'Planes Premium', value: parseFloat(data.revenue_saas), color: '#f59e0b' },   // Amber
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-200">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Finanzas & Revenue 💰</h1>
          <p className="text-slate-400 mt-1">Desglose de ingresos y flujo de caja.</p>
        </div>
      </div>

      {/* TARJETAS PRINCIPALES (GRID 2x2 en Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* GMV (Dinero movido) - Gris/Neutro */}
        <FinanceCard 
          title="GMV (Volumen Bruto)"
          value={formatMoney(data.gmv)}
          subtitle="Dinero total movido por locales"
          icon={Activity}
          color="slate"
        />

        {/* REVENUE TOTAL - Verde */}
        <FinanceCard 
          title="Ingresos Brutos"
          value={formatMoney(data.total_revenue)}
          subtitle="Comisiones + Suscripciones"
          icon={DollarSign}
          color="emerald"
          highlight
        />

        {/* PAGOS A SOCIOS - Rojo/Naranja */}
        <FinanceCard 
          title="Pago a Socios"
          value={formatMoney(data.costos_socios)}
          subtitle="Comisiones por referidos"
          icon={Users}
          color="rose"
        />

        {/* NET PROFIT - Cyan Brillante */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 shadow-xl shadow-cyan-900/20 transform hover:-translate-y-1 transition-transform border border-cyan-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider mb-1">Tu Ganancia Neta</p>
              <h3 className="text-3xl font-black text-white tracking-tight">{formatMoney(data.net_profit)}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="text-cyan-100">Dinero limpio</span>
            <span className="bg-white/20 px-2 py-1 rounded text-white font-bold text-xs">CASH</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRÁFICO: FUENTES DE INGRESO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-6">Composición de Ingresos</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                  formatter={(value) => formatMoney(value)}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Texto Central */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="text-xs text-slate-500 font-bold block">TOTAL</span>
                <span className="text-xl font-bold text-white">{formatMoney(data.total_revenue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ÚLTIMOS MOVIMIENTOS (TABLA) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Transacciones Recientes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800">
                  <th className="pb-3 pl-2">Tipo</th>
                  <th className="pb-3">Monto</th>
                  <th className="pb-3 text-right">Tu Ganancia</th>
                  <th className="pb-3 text-right pr-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.movimientos.map((mov, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${mov.tipo === 'PREMIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {mov.tipo === 'PREMIUM' ? <CreditCard className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-bold block text-slate-200">{mov.tipo === 'PREMIUM' ? 'Plan Premium' : 'Venta Local'}</span>
                          <span className="text-xs text-slate-500">ID: {mov.id.substring(0, 6)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300 font-mono">
                      {formatMoney(mov.monto)}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400 font-mono">
                      +{formatMoney(mov.ganancia)}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">
                        APROBADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Widget Card Reutilizable (Dark Mode)
function FinanceCard({ title, value, subtitle, icon: Icon, color, highlight }) {
  const colorMap = {
    slate: 'text-slate-400 bg-slate-800 border-slate-700',
    emerald: 'text-emerald-400 bg-emerald-900/10 border-emerald-500/30 shadow-emerald-900/20',
    rose: 'text-rose-400 bg-rose-900/10 border-rose-500/30 shadow-rose-900/20',
  };
  
  const theme = colorMap[color] || colorMap.slate;

  return (
    <div className={`rounded-2xl p-6 border shadow-lg transition-transform hover:-translate-y-1 ${theme}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-slate-950/30`}>
          <Icon className="w-5 h-5" />
        </div>
        {highlight && <ArrowUpRight className="w-4 h-4" />}
      </div>
      <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}