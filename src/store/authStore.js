import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  local: JSON.parse(localStorage.getItem('local')) || null, // 🔥 NUEVO: Guardamos el local
  isAuthenticated: !!localStorage.getItem('token'),

  // Acción de Login Actualizada
  login: (token, userData, localData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('local', JSON.stringify(localData));
    
    // 🔥 NUEVO: Persistir Rol (Si viene en userData, sino asumimos USER)
    // Asegúrate de que el backend devuelva el rol en el login
    const userRole = userData.rol || 'USER'; 
    
    set({ 
      token, 
      user: { ...userData, rol: userRole }, // Guardamos el rol dentro del user
      local: localData,
      isAuthenticated: true 
    });
  },

  // Acción de Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('local');
    set({ token: null, user: null, local: null, isAuthenticated: false });
  },
}));