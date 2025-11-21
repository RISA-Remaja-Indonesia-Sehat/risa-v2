import { create } from 'zustand';

const useLabsLocation = create((set) => ({
    labs: [],
    fetchLabs: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/labs`);
        const data = await response.json();
        set({ labs: data.data });
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    },
}));

export default useLabsLocation;