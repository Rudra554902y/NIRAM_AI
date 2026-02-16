import api from './api';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export const paymentService = {
  // Create order
  createOrder: async (amount, appointmentId) => {
    const response = await api.post('/payments/create-order', {
      amount,
      appointmentId
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },

  // Initiate Razorpay checkout
  openRazorpayCheckout: (order, onSuccess, onFailure) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: 'NIRAM AI',
      description: 'Appointment Booking',
      order_id: order.id,
      handler: async function (response) {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId: order.appointmentId
          };
          const result = await paymentService.verifyPayment(verifyData);
          onSuccess(result);
        } catch (error) {
          onFailure(error);
        }
      },
      prefill: {
        name: order.userName,
        email: order.userEmail,
        contact: order.userPhone
      },
      theme: {
        color: '#2563eb'
      },
      modal: {
        ondismiss: function() {
          onFailure(new Error('Payment cancelled'));
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  },
};

export default paymentService;
