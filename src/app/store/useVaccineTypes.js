import { create } from 'zustand';

const useVaccineTypes = create((set) => ({
  vaccineTypes:  [],
  fetchVaccineTypes: async () => {
      try {
        const response = await fetch('https://server-risa.vercel.app/api/vaccine');
        const data = await response.json();
        set({ vaccineTypes: data.data });
      } catch (error) {
        console.error('Error fetching vaccine types:', error);
      }
    },
}));

export default useVaccineTypes;