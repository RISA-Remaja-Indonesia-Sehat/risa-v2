import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExchangeHistory = create(
  persist(
    (set, get) => ({
      history: [],
      
      addExchange: (reward, voucherCode) => {
        const newExchange = {
          id: Date.now(),
          title: reward.title,
          cost: reward.cost,
          image: reward.image,
          voucherCode: voucherCode,
          date: new Date().toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          timestamp: Date.now()
        };
        
        set((state) => ({
          history: [newExchange, ...state.history]
        }));
      },
      
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'exchange-history'
    }
  )
);

export default useExchangeHistory;