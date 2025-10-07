import { create } from 'zustand';

const useLocationPermission = create((set) => ({
  locationPermission: false,
  setLocationPermission: (value) => set({ locationPermission: value }),
}));

export default useLocationPermission;