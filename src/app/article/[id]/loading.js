export default function Loading() {
  return (
    <>
      <section className="container my-12 mx-auto lg:flex items-center gap-6 overflow-hidden">
        <div className="p-6">
          {/* Article Image Skeleton */}
          <div className="w-full lg:w-4xl h-64 bg-gray-200 rounded animate-pulse mb-4"></div>

          {/* Article Title Skeleton */}
          <div className="mt-12 space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Opinion Section Skeleton */}
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
          </div>

          {/* Main Content Skeleton */}
          <div className="mt-12 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse ${i % 3 === 0 ? 'w-5/6' : i % 3 === 1 ? 'w-full' : 'w-4/5'}`}></div>
            ))}
          </div>

          {/* Share Button Skeleton */}
          <div className="p-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>

        {/* Sidebar Game Skeleton */}
        <aside className="bg-white rounded-sm shadow-lg h-fit max-w-72 lg:w-1/2 p-6 ml-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
          <div className="w-full h-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
        </aside>
      </section>

      {/* Comment Section Skeleton */}
      <section className="container my-12 pt-12 border-1 border-transparent border-t-gray-200 mx-auto px-4">
        {/* Comment Form Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
        
        {/* Comments Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}