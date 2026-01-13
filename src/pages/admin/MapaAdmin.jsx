import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import { Map as MapIcon, Loader2, Store } from 'lucide-react';
import L from 'leaflet';

// Fix para iconos de Leaflet en React
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapaAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coordenadas iniciales (Comodoro Rivadavia por defecto o promedio)
  const center = [-45.86413, -67.49656]; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/mapa');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-cyan-500"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4 animate-in fade-in">
      
      {/* HEADER FLOTANTE */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MapIcon className="w-8 h-8 text-violet-500" />
            Geo-Analytics
          </h1>
          <p className="text-slate-400 mt-1">Mapa táctico de cobertura y demanda.</p>
        </div>
        <div className="flex gap-4 text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Locales
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/50"></span> Zonas Calientes (Ventas)
          </div>
        </div>
      </div>

      {/* EL MAPA */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          {/* Capa Oscura (Dark Matter) para estilo Admin */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* CAPA 1: ZONAS DE CALOR (CÍRCULOS ROJOS) */}
          {data?.calor.map((zona, i) => (
            <CircleMarker 
              key={`heat-${i}`}
              center={[zona.lat, zona.lng]}
              pathOptions={{ 
                color: '#ef4444', 
                fillColor: '#ef4444', 
                fillOpacity: 0.2, 
                stroke: false 
              }}
              radius={20 + (parseInt(zona.intensidad) * 5)} // Más ventas = Círculo más grande
            />
          ))}

          {/* CAPA 2: LOCALES (MARKERS) */}
          {data?.locales.map((local) => (
            <Marker key={local.local_id} position={[local.lat, local.lng]}>
              <Popup className="custom-popup">
                <div className="p-1">
                  <strong className="text-slate-800 text-sm block">{local.nombre}</strong>
                  <span className="text-slate-500 text-xs">{local.rubro}</span>
                  <div className={`mt-2 text-xs font-bold px-2 py-1 rounded w-fit ${local.estado_manual === 'ABIERTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {local.estado_manual || 'DESC'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>
    </div>
  );
}