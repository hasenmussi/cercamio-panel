import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  local: JSON.parse(localStorage.getItem('local')) || null,
  // 🔥 NUEVO: Recuperar datos de socio si existen
  socio: JSON.parse(localStorage.getItem('socio')) || null, 
  
  isAuthenticated: !!localStorage.getItem('token'),

  // Acción de Login Actualizada (Ahora recibe socioData)
  login: (token, userData, localData, socioData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Persistencia Local (Tienda)
    if (localData) {
      localStorage.setItem('local', JSON.stringify(localData));
    } else {
      localStorage.removeItem('local');
    }

    // 🔥 NUEVO: Persistencia Socio
    if (socioData) {
      localStorage.setItem('socio', JSON.stringify(socioData));
    } else {
      localStorage.removeItem('socio');
    }
    
    // Persistir Rol (Si viene en userData, sino asumimos USER)
    const userRole = userData.rol || 'USER'; 
    
    set({ 
      token, 
      user: { ...userData, rol: userRole }, 
      local: localData,
      socio: socioData, // 🔥 Guardamos en estado
      isAuthenticated: true 
    });
  },

  // Acción de Logout
  logout: () => {
    localStorage.clear(); // Limpia todo (token, user, local, socio) de una vez
    set({ 
      token: null, 
      user: null, 
      local: null, 
      socio: null, // 🔥 Limpiamos socio
      isAuthenticated: false 
    });
  },
}));