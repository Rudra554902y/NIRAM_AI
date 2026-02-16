import React from 'react';

const ListSkeleton = ({ items = 5 }) => {
  return (
    <div className="card">
      <div className="space-y-4">
        {[...Array(items)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-200 last:border-b-0">
            <div className="shimmer h-12 w-12 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 w-3/4 rounded"></div>
              <div className="shimmer h-3 w-1/2 rounded"></div>
            </div>
            <div className="shimmer h-8 w-24 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSkeleton;
