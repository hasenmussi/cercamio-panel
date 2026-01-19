import { X, Trophy } from 'lucide-react';

export default function NivelesModal({ isOpen, onClose, currentLevel }) {
  if (!isOpen) return null;

  const niveles = [
    { nombre: "BRONCE", meta: "0 - 9 locales", ganancia: "5.0%", color: "bg-orange-700", text: "text-orange-100" },
    { nombre: "PLATA", meta: "10 - 29 locales", ganancia: "7.5%", color: "bg-slate-400", text: "text-slate-100" },
    { nombre: "ORO", meta: "30 - 59 locales", ganancia: "10.0%", color: "bg-amber-400", text: "text-amber-900" },
    { nombre: "PLATINO", meta: "60 - 99 locales", ganancia: "12.5%", color: "bg-slate-600", text: "text-white" },
    { nombre: "DIAMANTE", meta: "100+ locales", ganancia: "15.0%", color: "bg-cyan-500", text: "text-cyan-900" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Escalera de Éxito</h2>
              <p className="text-slate-400 text-xs">Tu potencial de ganancias</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-6 h-6" /></button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-3">
          {niveles.map((nivel, i) => {
            const esActual = currentLevel === nivel.nombre;
            return (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${esActual ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-md' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] ${nivel.color} ${nivel.text} shadow-sm`}>
                    {nivel.nombre[0]}
                  </div>
                  <div>
                    <p className={`font-bold ${esActual ? 'text-blue-900' : 'text-gray-700'}`}>{nivel.nombre}</p>
                    <p className="text-xs text-gray-500">{nivel.meta}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${esActual ? 'text-blue-600' : 'text-gray-400'}`}>{nivel.ganancia}</p>
                  {esActual && <p className="text-[10px] font-bold text-blue-500 uppercase">Nivel Actual</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">La comisión se calcula sobre el ingreso neto de CercaMío.</p>
        </div>
      </div>
    </div>
  );
}