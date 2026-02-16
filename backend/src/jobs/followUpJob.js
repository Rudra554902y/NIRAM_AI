const cron = require("node-cron");
const FollowUp = require("../models/FollowUp");

/**
 * Cron job to mark expired follow-ups
 * Runs daily at midnight (00:00)
 */
const startFollowUpExpiryJob = () => {
  // Run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running follow-up expiry job...");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all PENDING follow-ups where recommendedDate has passed
      const expiredFollowUps = await FollowUp.find({
        status: "PENDING",
        recommendedDate: { $lt: today },
      });

      if (expiredFollowUps.length === 0) {
        console.log("No expired follow-ups found");
        return;
      }

      // Update all expired follow-ups to EXPIRED status
      const updateResult = await FollowUp.updateMany(
        {
          status: "PENDING",
          recommendedDate: { $lt: today },
        },
        {
          $set: { status: "EXPIRED" },
        }
      );

      console.log(`✅ Expired ${updateResult.modifiedCount} follow-ups`);
    } catch (error) {
      console.error("❌ Error in follow-up expiry job:", error);
    }
  });

  console.log("✅ Follow-up expiry cron job started (runs daily at midnight)");
};

module.exports = { startFollowUpExpiryJob };
