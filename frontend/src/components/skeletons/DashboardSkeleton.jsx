import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="shimmer h-8 w-64 rounded"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="shimmer h-4 w-24 rounded mb-3"></div>
            <div className="shimmer h-8 w-16 rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="card space-y-4">
            <div className="shimmer h-6 w-40 rounded"></div>
            {[1, 2, 3].map((j) => (
              <div key={j} className="space-y-2">
                <div className="shimmer h-4 w-full rounded"></div>
                <div className="shimmer h-4 w-3/4 rounded"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
