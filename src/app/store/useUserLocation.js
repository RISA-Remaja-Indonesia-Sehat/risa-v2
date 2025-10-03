import { create } from 'zustand';

const useUserLocation = create((set) => ({
    position: null,
    setPosition: (latlng) => set({ position: latlng }),
}));

export default useUserLocation;