'use client';
import { useState } from 'react';
import useCommentStore from '../../store/useCommentStore';
import useMissions from '../../store/useMissions';
import useStickers from '../../store/useStickers';
import CustomButton from '../ui/CustomButton';
import StickerRewardAnimation from '../ui/StickerRewardAnimation';

export default function CommentForm() {
  const [userComment, setUserComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { addComment } = useCommentStore();
  const { trackComment } = useMissions();
  const { addStickers, updateStickersToServer } = useStickers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    if (!userComment.trim()) {
      alert('Tulis sesuatu dulu ya!');
      return;
    }
    
    await addComment(userComment);
    trackComment(addStickers, () => setShowAnimation(true), updateStickersToServer);
    console.log('Comment tracked');
    setUserComment('');
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Tulis komentar kamu..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm resize-none"
          />
        </div>
        <CustomButton 
          title="Kirim Komentar" 
          className="text-sm px-4 py-2 float-right" 
          onClick={handleSubmit}
          type="submit"
        />
      </form>
      
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded text-sm z-50">
          Komentar berhasil dikirim!
        </div>
      )}
      
      <StickerRewardAnimation 
        show={showAnimation} 
        onComplete={() => setShowAnimation(false)} 
      />
    </>
  );
}