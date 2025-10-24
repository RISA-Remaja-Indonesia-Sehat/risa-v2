import {create} from 'zustand';
import useAuthStore from './useAuthStore';

const useStickers = create((set, get) => {
  // Initialize stickers from user data
  const { user } = useAuthStore.getState();
  const initialStickers = user?.stickers ? user.stickers : 0;
  
  return {
    stickers: initialStickers,
    
    initStickers: async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        set({ stickers: 0 });
        return;
      }
      
      try {
        const user = JSON.parse(userData);
        const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          set({ stickers: result.data.stickers || 0 });
        } else {
          set({ stickers: 0 });
        }
      } catch (error) {
        console.error('Error fetching user stickers:', error);
        set({ stickers: 0 });
      }
    },
    
    addStickers: (amount) => set((state) => ({ stickers: state.stickers + amount })),
    deductStickers: (amount) => set((state) => ({ stickers: state.stickers - amount })),
    
    updateStickersToServer: async (newStickerCount) => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) return { success: false, error: 'No auth data' };
      
      try {
        const user = JSON.parse(userData);
        const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stickers: newStickerCount })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update stickers');
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error updating stickers:', error);
        return { success: false, error: error.message };
      }
    },
  };
});

export default useStickers;