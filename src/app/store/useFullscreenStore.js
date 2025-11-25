import { create } from 'zustand';

const useFullscreenStore = create((set) => ({
  isFullscreen: true,

  enterFullscreen: async () => {
    if (typeof window !== 'undefined') {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (nav) nav.style.display = 'none';
      if (footer) footer.style.display = 'none';
      
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen request failed:', err);
      }
      set({ isFullscreen: true });
    }
  },

  exitFullscreen: async () => {
    if (typeof window !== 'undefined') {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
      
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.warn('Exit fullscreen gagal:', err);
        }
      }
      set({ isFullscreen: false });
    }
  },

  reset: () => {
    if (typeof window !== 'undefined') {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    }
    set({ isFullscreen: false });
  }
}));

export default useFullscreenStore;
