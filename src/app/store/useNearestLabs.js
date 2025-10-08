import { create } from 'zustand';

const useNearestLabs = create((set) => ({
    nearestLabs: [],
    setNearestLabs: (labs) => set({ nearestLabs: labs }),
}));

export default useNearestLabs;