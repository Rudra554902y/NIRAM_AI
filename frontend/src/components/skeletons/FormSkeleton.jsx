import React from 'react';

const FormSkeleton = () => {
  return (
    <div className="card space-y-6">
      <div className="shimmer h-8 w-48 rounded"></div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="shimmer h-4 w-32 rounded"></div>
            <div className="shimmer h-10 w-full rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3">
        <div className="shimmer h-10 w-24 rounded"></div>
        <div className="shimmer h-10 w-24 rounded"></div>
      </div>
    </div>
  );
};

export default FormSkeleton;
