import { create } from 'zustand';

const useLabsLocation = create((set) => ({
    labs: [],
    fetchLabs: async () => {
      try {
        const response = await fetch('https://server-risa.vercel.app/api/labs');
        const data = await response.json();
        set({ labs: data.data });
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    },
}));

export default useLabsLocation;