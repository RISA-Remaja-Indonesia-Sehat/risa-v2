import { create } from 'zustand';

const useVaccineTypes = create((set) => ({
  vaccineTypes:  [],
  fetchVaccineTypes: async () => {
      try {
        const response = await fetch('https://68d5e386e29051d1c0afdc9e.mockapi.io/api/lab-prodia/vaccineTypes');
        const data = await response.json();
        set({ vaccineTypes: data });
      } catch (error) {
        console.error('Error fetching vaccine types:', error);
      }
    },
}));

export default useVaccineTypes;