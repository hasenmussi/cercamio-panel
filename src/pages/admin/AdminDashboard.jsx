export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-slate-800">Torre de Control 🗼</h1>
      <p className="text-slate-500 mt-2">Bienvenido al Modo Dios, Jefe.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700">Usuarios Totales</h3>
          <p className="text-3xl font-black text-cyan-600 mt-2">--</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700">Ventas Hoy</h3>
          <p className="text-3xl font-black text-blue-600 mt-2">--</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700">Ingresos</h3>
          <p className="text-3xl font-black text-emerald-600 mt-2">--</p>
        </div>
      </div>
    </div>
  );
}