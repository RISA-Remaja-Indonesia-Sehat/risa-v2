import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { googleLogout } from '@react-oauth/google';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (userData, userToken) => {
        set({
          user: userData,
          token: userToken,
          isLoggedIn: true
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        googleLogout();
      },

      initAuth: () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData && userData !== 'undefined') {
          try {
            const parsedUser = JSON.parse(userData);
            set({
              user: parsedUser,
              token: token,
              isLoggedIn: true
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);

export default useAuthStore;