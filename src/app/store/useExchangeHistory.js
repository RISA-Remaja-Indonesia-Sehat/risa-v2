import {create} from 'zustand';

const useExchangeHistory = create((set, get) => ({
  history: [],
  loading: false,
  
  addExchange: async (reward, voucherCode) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'No token found' };
    
    try {
      const response = await fetch('https://server-risa.vercel.app/api/reward/history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voucher_id: reward.id,
          voucherCode: voucherCode
        })
      });
      
      console.log('Sending data:', {
        voucher_id: reward.id,
        voucherCode: voucherCode
      });
      console.log('Token exists:', !!token);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to save exchange history: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API response result:', result);
      
      // Update local state
      const newExchange = {
        id: result.data?.id || Date.now(),
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
        })
      };
      
      set((state) => ({
        history: [newExchange, ...state.history]
      }));
      
      return { success: true, data: result };
    } catch (error) {
      console.error('Error adding exchange:', error);
      return { success: false, error: error.message };
    }
  },
  
  loadHistory: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    set({ loading: true });
    
    try {
      const response = await fetch('https://server-risa.vercel.app/api/reward/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      
      const result = await response.json();
      const historyData = result.data?.map(item => ({
        id: item.id,
        title: item.voucher?.title || 'Voucher',
        cost: item.voucher?.cost || 0,
        image: item.voucher?.image || '',
        voucherCode: item.voucherCode,
        date: new Date(item.claimedAt).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      })) || [];
      
      set({ history: historyData, loading: false });
    } catch (error) {
      console.error('Error loading history:', error);
      set({ loading: false });
    }
  },
  
  clearHistory: () => set({ history: [] })
}));

export default useExchangeHistory;