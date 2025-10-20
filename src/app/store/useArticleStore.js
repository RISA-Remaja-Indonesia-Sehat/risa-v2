import { create } from 'zustand';

const useArticleStore = create((set, get) => ({
  articles: [],
  loading: false,
  error: null,
  selectedArticle: null,
  
  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://server-risa.vercel.app/api/article"); // ganti URL sesuai API kamu
      if (!res.ok) throw new Error("Gagal fetch data artikel");

      const data = await res.json();
      set({ articles: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  
  fetchArticleById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://server-risa.vercel.app/api/article/${id}`);
      if (!res.ok) throw new Error("Artikel tidak ditemukan");

      const data = await res.json();
      set({ selectedArticle: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useArticleStore;