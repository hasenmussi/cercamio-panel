import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  local: JSON.parse(localStorage.getItem('local')) || null, // 🔥 NUEVO: Guardamos el local
  isAuthenticated: !!localStorage.getItem('token'),

  // Acción de Login (Ahora recibe también el objeto local)
  login: (token, userData, localData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('local', JSON.stringify(localData)); // Persistencia
    
    set({ 
      token, 
      user: userData, 
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