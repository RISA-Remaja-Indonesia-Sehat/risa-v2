import { create } from 'zustand';

const useCommentStore = create((set, get) => ({
  comments: [],
  loading: true,
  currentArticleId: null,
  
  loadComments: async (articleId) => {
    if (!articleId) return;
    
    set({ loading: true, currentArticleId: articleId });
    try {
      const response = await fetch(`https://server-risa.vercel.app/api/article/${articleId}/comment`);
      const data = await response.json();
      set({ comments: data.data || [], loading: false });
    } catch (error) {
      console.error('Error loading comments:', error);
      set({ comments: [], loading: false });
    }
  },
  
  addComment: async (commentText) => {
    const { currentArticleId } = get();
    if (!currentArticleId || !commentText.trim()) return;

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    const newComment = {
      user: {
        name: user?.name || 'Anonim'
      },
      comment: commentText.trim(),
      isUserComment: true
    };

    // Optimistic update
    set(state => ({
      comments: [newComment, ...state.comments]
    }));

    try {
      const response = await fetch(`https://server-risa.vercel.app/api/article/${currentArticleId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: commentText.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      // Reload comments to get server data
      get().loadComments(currentArticleId);
    } catch (error) {
      console.error('Error posting comment:', error);
      // Revert optimistic update on error
      set(state => ({
        comments: state.comments.slice(1)
      }));
    }
  }
}));

export default useCommentStore;