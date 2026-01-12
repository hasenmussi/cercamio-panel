import Sidebar from '../components/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* EL MARGEN IZQUIERDO (ml-64) DEJA ESPACIO AL SIDEBAR FIJO */}
      <main className="ml-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}