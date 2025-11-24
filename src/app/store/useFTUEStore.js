import { create } from 'zustand';

const useFTUEStore = create((set) => ({
  currentStep: 0,
  showDialog: false,
  highlightElement: null,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  setShowDialog: (show) => set({ showDialog: show }),
  setHighlightElement: (element) => set({ highlightElement: element }),
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  resetFTUE: () => set({ currentStep: 0, showDialog: false, highlightElement: null }),
  
  isFTUEComplete: () => {
    const ftueComplete = localStorage.getItem('ftue-complete');
    return ftueComplete === 'true';
  },
  
  completeFTUE: () => {
    localStorage.setItem('ftue-complete', 'true');
    set({ currentStep: 0, showDialog: false });
  }
}));

export default useFTUEStore;
