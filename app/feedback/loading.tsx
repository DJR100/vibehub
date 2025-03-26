export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="h-10 w-64 bg-gray-800 rounded-md mb-8 animate-pulse"></div>

        <div className="rounded-lg border border-gray-800 bg-card p-6 space-y-6">
          <div>
            <div className="h-8 w-48 bg-gray-800 rounded-md mb-4 animate-pulse"></div>
            <div className="h-4 w-full bg-gray-800 rounded-md mb-4 animate-pulse"></div>

            <div className="h-32 w-full bg-gray-800 rounded-md mb-6 animate-pulse"></div>
          </div>

          <div>
            <div className="h-6 w-40 bg-gray-800 rounded-md mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded-md animate-pulse"></div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="h-4 w-3/4 bg-gray-800 rounded-md mb-6 animate-pulse"></div>

            <div className="flex justify-end">
              <div className="h-10 w-32 bg-gray-800 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

