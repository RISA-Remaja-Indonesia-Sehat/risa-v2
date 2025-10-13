export default function CommentItem({ comment }) {
  const nameColor = comment.isUserComment ? 'text-pink-600' : 'text-gray-800';
  const avatarColor = comment.isUserComment ? 'bg-pink-500' : 'bg-gray-500';
  
  return (
    <div className="border-b border-gray-100 pb-3 mb-3">
      <div className="flex items-center mb-2">
        <div className={`w-6 h-6 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-medium mr-2`}>
          {comment.name.charAt(0).toUpperCase()}
        </div>
        <h5 className={`font-medium ${nameColor}`}>
          {comment.name}
          {comment.isUserComment && <span className="text-xs text-pink-500 ml-2">(Baru)</span>}
        </h5>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed ml-8">{comment.body}</p>
    </div>
  );
}