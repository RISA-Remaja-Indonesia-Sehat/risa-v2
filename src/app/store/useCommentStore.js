import { create } from 'zustand';

const useCommentStore = create((set, get) => ({
  comments: [],
  loading: true,
  
  loadComments: async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      set({ comments: data.slice(0, 5), loading: false });
    } catch (error) {
      console.error('Error loading comments:', error);
      set({ loading: false });
    }
  },
  
  addComment: (name, body) => {
    const newComment = {
      id: Date.now(),
      name: name.trim() || 'Anonim',
      body: body.trim(),
      isUserComment: true
    };
    
    set(state => ({
      comments: [newComment, ...state.comments]
    }));
  }
}));

export default useCommentStore;