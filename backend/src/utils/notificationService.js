const nodemailer = require("nodemailer");

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send follow-up email to patient
 * @param {Object} patient - Patient details (name, email)
 * @param {String} dashboardLink - Link to patient dashboard
 * @param {String} confirmLink - Link to confirm follow-up
 * @param {String} receptionistNumber - Reception contact number
 */
exports.sendFollowUpEmail = async (patient, dashboardLink, confirmLink, receptionistNumber) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: "Follow-Up Appointment Reminder - NIRAM AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Follow-Up Appointment Reminder</h2>
          <p>Dear ${patient.name},</p>
          <p>Your doctor has recommended a follow-up appointment. Please confirm your availability at your earliest convenience.</p>
          
          <div style="margin: 20px 0;">
            <a href="${confirmLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Confirm Follow-Up
            </a>
          </div>
          
          <p>Or visit your dashboard to manage appointments:</p>
          <p><a href="${dashboardLink}" style="color: #3498db;">${dashboardLink}</a></p>
          
          <p>If you have any questions, please contact our reception:</p>
          <p><strong>Reception: ${receptionistNumber}</strong></p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #7f8c8d; font-size: 12px;">
            This is an automated message from NIRAM AI Healthcare System.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Follow-up email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending follow-up email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send SMS (simulated via console log for now)
 * @param {String} phone - Phone number
 * @param {String} message - SMS message
 */
exports.sendSMS = async (phone, message) => {
  try {
    // TODO: Integrate with actual SMS provider (Twilio, MSG91, etc.)
    console.log("=== SMS Notification ===");
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log("========================");
    return { success: true, simulated: true };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send appointment confirmation email
 * @param {Object} patient - Patient details
 * @param {Object} appointment - Appointment details
 */
exports.sendAppointmentConfirmationEmail = async (patient, appointment) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: "Appointment Confirmation - NIRAM AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Appointment Confirmed</h2>
          <p>Dear ${patient.name},</p>
          <p>Your appointment has been successfully confirmed.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            <p><strong>Status:</strong> Confirmed</p>
          </div>
          
          <p>Please arrive 10 minutes before your scheduled time.</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #7f8c8d; font-size: 12px;">
            This is an automated message from NIRAM AI Healthcare System.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Appointment confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error: error.message };
  }
};
