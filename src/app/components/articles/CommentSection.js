import CommentList from './CommentList';

export default function CommentSection() {
  return (
    <div className="mt-20">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Komentar</h4>
      <CommentList />
    </div>
  );
}
