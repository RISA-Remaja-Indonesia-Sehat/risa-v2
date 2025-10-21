export default function Loading() {
  return (
    <>
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
          <div className="w-20 h-1 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>
    </>
  );
}