import { create } from 'zustand';

const usePubertyQuestStore = create((set, get) => ({
  progress: [],
  currentChapter: null,
  loading: false,

  fetchProgress: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/puberty-quest/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        set({ progress: data.data });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      set({ loading: false });
    }
  },

  saveProgress: async (chapter, score, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/puberty-quest/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chapter, score, completed })
      });
      const data = await response.json();
      if (data.success) {
        await get().fetchProgress();
        return data.data;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

  getChapterProgress: (chapter) => {
    const { progress } = get();
    return progress.find(p => p.chapter === chapter);
  }
}));

export default usePubertyQuestStore;