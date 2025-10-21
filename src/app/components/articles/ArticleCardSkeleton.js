export default function ArticleCardSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <div className="aspect-video bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
}