'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useCommentStore from '../../store/useCommentStore';
import CommentItem from './CommentItem';

export default function CommentList() {
  const { id } = useParams();
  const { comments, loading, loadComments } = useCommentStore();

  useEffect(() => {
    if (id) {
      loadComments(id);
    }
  }, [id, loadComments]);

  if (loading) {
    return <p className="text-gray-500 text-center py-4">Memuat komentar...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 text-center py-4">Belum ada komentar</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment, index) => (
        <CommentItem key={comment.id || `comment-${index}-${Date.now()}`} comment={comment} />
      ))}
    </div>
  );
}