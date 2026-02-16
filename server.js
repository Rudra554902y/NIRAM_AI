require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startFollowUpExpiryJob } = require("./src/jobs/followUpJob");

// Suppress specific warnings
process.removeAllListeners('warning');

// Connect to database
connectDB();

// Start cron jobs
startFollowUpExpiryJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n🚀 ═══════════════════════════════════════════════════════════");
  console.log(`   NIRAM AI Server Running`);
  console.log("   ═══════════════════════════════════════════════════════════");
  console.log(`   🌐 Local:    http://localhost:${PORT}`);
  console.log(`   🔐 Auth:     http://localhost:${PORT}/api/auth`);
  console.log(`   👨‍⚕️  Doctors:  http://localhost:${PORT}/api/doctors/list`);
  console.log(`   📅 Slots:    http://localhost:${PORT}/api/appointments/available-slots`);
  console.log("   ═══════════════════════════════════════════════════════════");
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log("   ═══════════════════════════════════════════════════════════\n");
});
