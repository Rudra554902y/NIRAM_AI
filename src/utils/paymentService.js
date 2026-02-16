const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance only if credentials are provided
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else if (process.env.NODE_ENV !== "test") {
  console.warn("Razorpay not configured - RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing");
}

/**
 * Create Razorpay order
 * @param {Number} amount - Amount in rupees (will be converted to paise)
 * @param {String} currency - Currency code (default: INR)
 * @param {String} receipt - Receipt ID
 * @returns {Object} Order details
 */
exports.createOrder = async (amount, currency = "INR", receipt) => {
  try {
    if (!razorpayInstance) {
      // Fallback for testing or when Razorpay is not configured
      return {
        success: true,
        order: {
          id: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency,
          receipt,
        },
      };
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    };

    const order = await razorpayInstance.orders.create(options);
    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} Verification result
 */
exports.verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
};

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Object} Payment details
 */
exports.getPaymentDetails = async (paymentId) => {
  try {
    if (!razorpayInstance) {
      // Fallback for testing or when Razorpay is not configured
      return {
        success: true,
        payment: {
          id: paymentId,
          status: "captured",
        },
      };
    }

    const payment = await razorpayInstance.payments.fetch(paymentId);
    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
