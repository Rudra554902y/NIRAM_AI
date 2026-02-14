const OpenAI = require("openai");
const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getMedicalSummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Validate patientId
    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    // Verify doctor authorization
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(403).json({ error: "Only doctors can access medical summaries" });
    }

    // 1️⃣ Fetch patient profile
    const patient = await Patient.findById(patientId)
      .populate("userId", "name");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Fetch previous prescriptions
    const appointments = await Appointment.find({
      patientId: patient.userId,
    });

    const appointmentIds = appointments.map(a => a._id);

    const prescriptions = await Prescription.find({
      appointmentId: { $in: appointmentIds },
    }).limit(10).sort({ createdAt: -1 }); // Last 10 prescriptions

    const previousNotes = prescriptions
      .map(p => p.notes || "")
      .filter(note => note.trim() !== "")
      .join(" | ");

    // 3️⃣ Construct medical prompt
    const prompt = `
You are a clinical assistant helping a doctor quickly understand a patient before consultation.

Return JSON only with this structure:
{
  "critical_alerts": [],
  "allergy_risk": [],
  "chronic_conditions": [],
  "visit_pattern_summary": "",
  "doctor_brief": ""
}

Patient Info:
Name: ${patient.userId?.name || "N/A"}
Age: ${patient.age || "N/A"}
Gender: ${patient.gender || "N/A"}
Blood Group: ${patient.bloodGroup || "N/A"}
Allergies: ${patient.allergies?.length > 0 ? patient.allergies.join(", ") : "None"}
Chronic Diseases: ${patient.chronicDiseases?.length > 0 ? patient.chronicDiseases.join(", ") : "None"}
Medical History: ${patient.medicalHistory?.length > 0 ? JSON.stringify(patient.medicalHistory) : "None"}
Previous Visit Notes: ${previousNotes || "No previous notes"}
Total Visits: ${appointments.length}

Be concise. Highlight medical risks only if relevant.
`;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: "OpenAI API key not configured",
        fallbackSummary: {
          patient: patient.userId?.name || "Unknown",
          age: patient.age || "N/A",
          allergies: patient.allergies || [],
          chronicDiseases: patient.chronicDiseases || [],
          totalVisits: appointments.length,
        }
      });
    }

    // 4️⃣ Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a medical summarization assistant. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    });

    const aiOutput = response.choices[0].message.content;

    // Parse JSON response
    let summary;
    try {
      // Remove markdown code blocks if present
      const jsonString = aiOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      summary = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiOutput);
      summary = { raw: aiOutput };
    }

    // Update last summary generation timestamp
    patient.lastSummaryGeneratedAt = new Date();
    await patient.save();

    res.json({
      summary,
      patientInfo: {
        name: patient.userId?.name,
        age: patient.age,
        bloodGroup: patient.bloodGroup,
        totalVisits: appointments.length,
      }
    });

  } catch (error) {
    console.error("AI Summary Error:", error);
    
    // Provide more specific error messages
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: "OpenAI API quota exceeded. Please check your billing." 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        error: "Invalid OpenAI API key configuration" 
      });
    }

    res.status(500).json({ 
      error: "Failed to generate AI summary",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
