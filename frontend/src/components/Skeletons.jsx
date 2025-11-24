export const HeaderSkeleton = () => (
  <div className="animate-pulse flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full px-4 sm:px-0">
    {/* Profile Picture */}
    <div className="w-28 h-28 rounded-full bg-gray-200 border-2 border-gray-200 shadow-md flex-shrink-0" />

    {/* Username + bio + stats */}
    <div className="flex-1 w-full flex flex-col sm:justify-between">
      {/* Username & Bio */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3">
        <div className="flex flex-col items-center sm:items-start w-full gap-2">
          {/* Username */}
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          {/* Bio */}
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

        {/* Edit button */}
        <div className="h-8 flex justify-center w-24 px-auto mx-auto bg-gray-200 items-center rounded mt-2 sm:mt-0"></div>
      </div>

      {/* Stats */} 
      <div className="flex justify-center sm:justify-start gap-10 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-3 w-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const GridSkeleton = () => (
  <div className="grid grid-cols-3 gap-3 mt-6 px-4 sm:px-0">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="w-full aspect-square bg-gray-200 rounded-lg" />
    ))}
  </div>
);
