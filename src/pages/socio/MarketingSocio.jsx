import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // 🔥 LIBRERÍA INSTALADA
import { Copy, Share2, MessageCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function MarketingSocio() {
  const socio = useAuthStore((state) => state.socio);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Link de reclutamiento (apunta a la landing, el socio debe dar el código verbalmente o por mensaje)
  // O idealmente: https://cercamio.app?ref=CODIGO (si tu landing soporta refs)
  // Por ahora usamos link simple + código visible.
  const linkRef = "https://cercamio.app";

  const scripts = [
    {
      titulo: "Para Comerciantes (Formal) 🏪",
      texto: `Hola! Soy socio de CercaMío, la nueva App de Comodoro. Estamos seleccionando locales para el lanzamiento y me gustaría invitarte. Es sin costo fijo y con comisiones mucho más bajas que las apps de siempre. \n\nDescargala acá: ${linkRef} \n\n🔑 Usá mi código de invitación: *${socio?.codigo}* para tener prioridad.`
    },
    {
      titulo: "Para Emprendedores (Cercano) 🚀",
      texto: `Hola! Vi lo que hacés y está genial. Te quería invitar a sumarte a CercaMío, una app para vender en el barrio sin depender solo de Instagram. \n\nEs gratis probar. Bajala acá: ${linkRef} \n\n🔑 Mi código es: *${socio?.codigo}*`
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kit de Marketing 📢</h1>
        <p className="text-gray-500 mt-1">Herramientas para reclutar más rápido.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: TU QR PERSONAL */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border border-gray-100 mb-6">
            <QRCodeSVG 
              value={linkRef} 
              size={200} 
              level={"H"}
              imageSettings={{
                src: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Icono genérico o logo CercaMío
                x: null, y: null, height: 40, width: 40, excavate: true,
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tu Pase Digital</h3>
          <p className="text-sm text-gray-500 mb-6">Muestra este QR al comerciante para que descargue la App al instante.</p>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Tu Código</p>
            <p className="text-2xl font-mono font-black text-blue-900 tracking-widest">{socio?.codigo || '---'}</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: GUIONES DE VENTA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-800">Guiones para WhatsApp / Instagram</h3>
          </div>

          {scripts.map((script, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-700">{script.titulo}</h4>
                <button 
                  onClick={() => handleCopy(script.texto, i)}
                  className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold
                    ${copiedIndex === i ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-slate-800 hover:text-white'}`}
                >
                  {copiedIndex === i ? <><CheckCircle className="w-3 h-3" /> COPIADO</> : <><Copy className="w-3 h-3" /> COPIAR</>}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 font-mono whitespace-pre-wrap leading-relaxed border border-gray-100">
                {script.texto}
              </div>
            </div>
          ))}
          
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
             <div className="p-2 bg-yellow-100 rounded-full h-fit"><Share2 className="w-4 h-4 text-yellow-700" /></div>
             <div>
               <h5 className="font-bold text-yellow-800 text-sm">Tip de Profesional</h5>
               <p className="text-xs text-yellow-700 mt-1">No envíes el mensaje y desaparezcas. Pregunta: <i>"¿Te sirvió el link?"</i> o <i>"¿Pudiste ver la app?"</i>. El seguimiento cierra la venta.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}