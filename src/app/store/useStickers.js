import {create} from 'zustand';

const useStickers = create((set) => ({
  stickers: 0,
  addStickers: (amount) => set((state) => ({ stickers: state.stickers + amount })),
  deductStickers: (amount) => set((state) => ({ stickers: state.stickers - amount })),
}));

export default useStickers;