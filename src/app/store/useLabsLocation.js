import { create } from 'zustand';

const useLabsLocation = create((set) => ({
    labs: [],
    fetchLabs: async () => {
      try {
        const response = await fetch('https://68d5e386e29051d1c0afdc9e.mockapi.io/api/lab-prodia/locations');
        const data = await response.json();
        set({ labs: data });
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    },
}));

export default useLabsLocation;