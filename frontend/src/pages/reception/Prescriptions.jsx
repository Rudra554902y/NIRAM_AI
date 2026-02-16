import React, { useState, useEffect } from 'react';
import prescriptionService from '../../services/prescriptionService';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import TableSkeleton from '../../components/skeletons/TableSkeleton';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

const ReceptionPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAllPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCash = async (id) => {
    if (!confirm('Confirm cash payment received?')) return;

    try {
      await prescriptionService.confirmCashPayment(id);
      toast.success('Cash payment confirmed');
      fetchPrescriptions();
    } catch (error) {
      toast.error('Failed to confirm payment');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Prescriptions</h1>
        <TableSkeleton rows={10} columns={6} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Prescriptions</h1>

      {prescriptions.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.map((prescription) => (
                  <tr key={prescription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {prescription.patient?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {prescription.patient?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {prescription.doctor?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(prescription.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{prescription.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={prescription.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {prescription.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => handleConfirmCash(prescription._id)}
                          className="flex items-center text-green-600 hover:text-green-900"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Confirm Cash
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      )}
    </div>
  );
};

export default ReceptionPrescriptions;
