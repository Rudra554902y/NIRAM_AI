import React from 'react';
import { getStatusColor } from '../utils/statusColors';

export const StatusBadge = ({ status }) => {
  const colors = getStatusColor(status);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
      {colors.label}
    </span>
  );
};

export default StatusBadge;
