import { useEffect, useState } from 'react';
import api from '../services/api';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/mi-negocio/analytics');
        setData(res.data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper Moneda
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-blue-600">Cargando tablero...</div>;
  if (!data) return <div>Error de carga</div>;

  const { kpis, chart_data, top_productos } = data;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
        <p className="text-gray-500 text-sm">Lo que está pasando hoy en tu negocio.</p>
      </div>

      {/* KPIS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
          title="Ingresos Totales" 
          value={formatMoney(kpis.ingresos_totales)} 
          icon={DollarSign} 
          color="bg-blue-600" 
          trend="+12% este mes"
        />
        <KpiCard 
          title="Ventas Realizadas" 
          value={kpis.cantidad_ventas} 
          icon={ShoppingCart} 
          color="bg-purple-600" 
        />
        <KpiCard 
          title="Ticket Promedio" 
          value={formatMoney(kpis.ticket_promedio)} 
          icon={TrendingUp} 
          color="bg-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO (OCUPA 2 COLUMNAS) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Evolución de Ventas (7 días)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart_data}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="fecha" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [formatMoney(value), "Ventas"]}
                />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RANKING (OCUPA 1 COLUMNA) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Productos Top 🔥</h3>
          <div className="space-y-4">
            {top_productos.map((p, i) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {p.foto_url ? <img src={p.foto_url} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.nombre_oficial}</p>
                  <p className="text-xs text-gray-500">{p.total_unidades} un. vendidas</p>
                </div>
                <span className="text-sm font-bold text-gray-700">{formatMoney(p.total_dinero)}</span>
              </div>
            ))}
            {top_productos.length === 0 && <p className="text-sm text-gray-400">Sin datos aún.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

// Widget Simple KPI
function KpiCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">{trend}</span>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 text-${color.replace('bg-', '')}`} /> 
        {/* Nota: Tailwind necesita clases completas para purgar, en prod mejor usar mapa de colores */}
      </div>
    </div>
  );
}