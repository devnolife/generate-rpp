import { Skeleton } from "@/components/ui/skeleton"

export function SoalSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Filter Jenis Soal Skeleton */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div>
        {/* Identitas Skeleton */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Pilihan Ganda Skeleton */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 ml-2 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0 mt-0.5" />
                    <div className="space-y-4 w-full">
                      <Skeleton className="h-24 w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4 rounded-md" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-12 w-full rounded-lg" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menjodohkan Skeleton */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 ml-2 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>

        {/* Benar/Salah Skeleton */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 ml-2 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>

        {/* Essay Skeleton */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden mb-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 ml-2 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

