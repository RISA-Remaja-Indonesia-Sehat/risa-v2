import { create } from 'zustand';

const useLocationToast = create((set) => ({
  showToast: false,
  setShowToast: (value) => set({ showToast: value }),
}));

export default useLocationToast;