import React from 'react';

const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card space-y-4">
          <div className="shimmer h-6 w-3/4 rounded"></div>
          <div className="space-y-2">
            <div className="shimmer h-4 w-full rounded"></div>
            <div className="shimmer h-4 w-5/6 rounded"></div>
            <div className="shimmer h-4 w-4/6 rounded"></div>
          </div>
          <div className="flex justify-between items-center pt-4">
            <div className="shimmer h-4 w-24 rounded"></div>
            <div className="shimmer h-8 w-20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
