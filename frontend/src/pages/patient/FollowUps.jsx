import React, { useState, useEffect } from 'react';
import followUpService from '../../services/followUpService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import ListSkeleton from '../../components/skeletons/ListSkeleton';
import toast from 'react-hot-toast';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const data = await followUpService.getMyFollowUps();
      setFollowUps(data);
    } catch (error) {
      toast.error('Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await followUpService.confirmFollowUp(id);
      toast.success('Follow-up confirmed');
      fetchFollowUps();
    } catch (error) {
      toast.error('Failed to confirm follow-up');
    }
  };

  const handleDecline = async (id) => {
    if (!confirm('Are you sure you want to decline this follow-up?')) return;

    try {
      await followUpService.declineFollowUp(id);
      toast.success('Follow-up declined');
      fetchFollowUps();
    } catch (error) {
      toast.error('Failed to decline follow-up');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Follow-ups</h1>
        <ListSkeleton items={5} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Follow-ups</h1>

      {followUps.length > 0 ? (
        <div className="space-y-4">
          {followUps.map((followUp) => (
            <div key={followUp._id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {followUp.doctor?.name}
                    </h3>
                    <StatusBadge status={followUp.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Follow-up Date:</span>{' '}
                    {formatDate(followUp.followUpDate)}
                  </p>
                  {followUp.reason && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {followUp.reason}
                    </p>
                  )}
                </div>

                {followUp.status === 'PENDING' && (
                  <div className="flex space-x-3 ml-4">
                    <button
                      onClick={() => handleConfirm(followUp._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDecline(followUp._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No follow-ups found</p>
        </div>
      )}
    </div>
  );
};

export default FollowUps;
