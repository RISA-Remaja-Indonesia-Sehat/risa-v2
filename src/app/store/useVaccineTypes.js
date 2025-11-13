import { create } from 'zustand';

const useVaccineTypes = create((set) => ({
  vaccineTypes:  [],
  fetchVaccineTypes: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccine`);
        const data = await response.json();
        set({ vaccineTypes: data.data });
      } catch (error) {
        console.error('Error fetching vaccine types:', error);
      }
    },
}));

export default useVaccineTypes;