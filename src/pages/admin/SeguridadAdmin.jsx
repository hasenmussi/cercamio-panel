import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ShieldAlert, Terminal, AlertTriangle, UserX, Activity } from 'lucide-react';

export default function SeguridadAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs');
      setLogs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Icono según acción
  const getIcon = (accion) => {
    if (accion.includes('BAN')) return <UserX className="w-4 h-4 text-red-500" />;
    if (accion.includes('LOGIN')) return <Activity className="w-4 h-4 text-green-500" />;
    return <Terminal className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            Seguridad & Logs
          </h1>
          <p className="text-slate-400 mt-1">Registro inmutable de acciones administrativas.</p>
        </div>
      </div>

      {/* CONSOLA DE LOGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
        
        {/* Fake Terminal Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <span className="ml-2 text-slate-500 text-xs">system_audit.log</span>
        </div>

        {/* Listado */}
        <div className="max-h-[70vh] overflow-y-auto p-2">
          {loading ? (
            <div className="p-10 text-center text-slate-600 animate-pulse">Scanning system events...</div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center text-slate-600">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Sin eventos registrados.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="text-slate-500 border-b border-slate-800/50">
                <tr>
                  <th className="p-3 font-normal">TIMESTAMP</th>
                  <th className="p-3 font-normal">ADMIN</th>
                  <th className="p-3 font-normal">EVENTO</th>
                  <th className="p-3 font-normal">DETALLE</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {logs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-slate-800/50 transition-colors border-b border-slate-800/30">
                    <td className="p-3 text-slate-500 whitespace-nowrap">{log.fecha_fmt}</td>
                    <td className="p-3 flex items-center gap-2">
                      <img src={log.admin_foto} className="w-5 h-5 rounded-full grayscale opacity-70" />
                      <span className="text-xs text-cyan-600">{log.admin_nombre}</span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded border ${log.accion.includes('BAN') ? 'bg-red-900/10 border-red-900/30 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        {getIcon(log.accion)}
                        {log.accion}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-md" title={log.detalle}>
                      {log.detalle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}