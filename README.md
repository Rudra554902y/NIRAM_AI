# NIRAM AI - Local Clinic Management System

A comprehensive clinic management system with AI-powered medical summaries, appointment scheduling, prescription management, and Google OAuth authentication.

## 🚀 Features

- **Patient Management**: Registration, medical history, file uploads
- **Doctor Management**: Profile management, appointment viewing, emergency leave
- **Appointment System**: Slot booking, rescheduling, status tracking
- **Prescription Management**: Digital prescriptions, medicine tracking
- **AI Medical Summary**: OpenAI-powered patient health summaries
- **Staff Management**: Super Doctor can add doctors and receptionists
- **Google OAuth 2.0**: Sign in with Google for patients
- **Role-Based Access Control**: PATIENT, DOCTOR, RECEPTIONIST, SUPER_DOCTOR

## 📋 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, Passport.js (Google OAuth 2.0)
- **AI Integration**: OpenAI GPT-4o-mini
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- OpenAI API key
- Google OAuth 2.0 credentials (optional)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/NIRAM_AI.git
cd NIRAM_AI/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key

# Session Secret
SESSION_SECRET=your-session-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

4. **Seed Super Doctor**
```bash
node seed.js
```

This creates a Super Doctor account:
- Email: `superdoctor@niram.com`
- Password: `super123`

5. **Start the server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register Patient
**POST** `/auth/register`

Register a new patient account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "PATIENT"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `409`: Email or phone already registered

---

### 2. Login
**POST** `/auth/login`

Login for all roles (PATIENT, DOCTOR, RECEPTIONIST).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  }
}
```

**Note:** JWT token is set as HTTP-only cookie.

**Errors:**
- `400`: Missing email or password
- `401`: Invalid credentials

---

### 3. Logout
**POST** `/auth/logout`

Logout and clear authentication cookie.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 4. Get Current User
**GET** `/auth/me`

Get currently authenticated user details.

**Headers:**
- Cookie: `token=<jwt-token>`

**Response (200):**
```json
{
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "PATIENT",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `401`: Not authenticated
- `404`: User not found

---

### 5. Google OAuth Login
**GET** `/auth/google`

Initiate Google OAuth 2.0 login flow. Redirects to Google login page.

**Response:** Redirect to Google consent screen

---

### 6. Google OAuth Callback
**GET** `/auth/google/callback`

Handles Google OAuth callback. Automatically called by Google after user authorization.

**Response:** Redirect to `FRONTEND_URL/dashboard?login=success` with JWT cookie set

---

## 👥 Staff Management (Super Doctor Only)

### 7. Create Staff
**POST** `/staff/create`

Create a new doctor or receptionist account.

**Auth:** Super Doctor only

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@clinic.com",
  "phone": "9876543210",
  "password": "doctor123",
  "role": "DOCTOR",
  "specialization": "Cardiology",
  "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "startTime": "09:00",
  "endTime": "17:00",
  "slotDuration": 15
}
```

**Note:** For RECEPTIONIST role, omit doctor-specific fields.

**Response (201):**
```json
{
  "message": "DOCTOR created successfully",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1b",
    "name": "Dr. Jane Smith",
    "email": "jane@clinic.com",
    "phone": "9876543210",
    "role": "DOCTOR"
  }
}
```

**Errors:**
- `400`: Invalid role or missing fields
- `403`: Not a Super Doctor
- `409`: Email or phone already exists

---

### 8. Get All Staff
**GET** `/staff`

List all doctors and receptionists.

**Auth:** Super Doctor only

**Response (200):**
```json
{
  "staff": [
    {
      "id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "Dr. Jane Smith",
      "email": "jane@clinic.com",
      "phone": "9876543210",
      "role": "DOCTOR",
      "doctorDetails": {
        "specialization": "Cardiology",
        "workingDays": ["Monday", "Tuesday", "Wednesday"],
        "startTime": "09:00",
        "endTime": "17:00",
        "slotDuration": 15,
        "isSuperDoctor": false
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 5,
  "doctors": 3,
  "receptionists": 2
}
```

---

### 9. Delete Staff
**DELETE** `/staff/:id`

Delete a doctor or receptionist account.

**Auth:** Super Doctor only

**Parameters:**
- `id`: Staff member user ID

**Response (200):**
```json
{
  "message": "DOCTOR deleted successfully"
}
```

**Errors:**
- `400`: Cannot delete patients
- `403`: Cannot delete Super Doctor
- `404`: Staff not found

---

## 📅 Appointment Endpoints

### 10. Get Available Slots
**GET** `/appointments/available-slots`

Get available appointment slots for a doctor on a specific date.

**Query Parameters:**
- `doctorId`: Doctor ID (required)
- `date`: Date in ISO format (required)

**Example:** `/appointments/available-slots?doctorId=60d5ec49&date=2024-01-20`

**Response (200):**
```json
{
  "slots": ["09:00", "09:15", "09:30", "10:00", "10:15"],
  "total": 5,
  "message": "Doctor not available on this day"
}
```

**Errors:**
- `400`: Missing parameters
- `404`: Doctor not found

---

### 11. Book Appointment
**POST** `/appointments`

Book an appointment with a doctor.

**Auth:** PATIENT or RECEPTIONIST

**Request Body:**
```json
{
  "doctorId": "60d5ec49f1b2c72b8c8e4f1b",
  "date": "2024-01-20T00:00:00.000Z",
  "timeSlot": "10:30"
}
```

**Response (201):**
```json
{
  "_id": "60d5ec49f1b2c72b8c8e4f1c",
  "patientId": "60d5ec49f1b2c72b8c8e4f1a",
  "doctorId": "60d5ec49f1b2c72b8c8e4f1b",
  "date": "2024-01-20T00:00:00.000Z",
  "timeSlot": "10:30",
  "status": "BOOKED",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `400`: Missing required fields
- `401`: Not authenticated
- `404`: Doctor not found
- `409`: Slot already booked

---

### 12. Get Doctor's Today Appointments
**GET** `/appointments/doctor/today`

Get all appointments for the logged-in doctor today.

**Auth:** DOCTOR

**Response (200):**
```json
{
  "appointments": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "patientId": {
        "name": "John Doe",
        "phone": "1234567890",
        "email": "john@example.com"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "10:30",
      "status": "BOOKED"
    }
  ],
  "total": 8,
  "booked": 5,
  "seen": 3
}
```

---

### 13. Get Reception Today Appointments
**GET** `/appointments/reception/today`

Get all appointments across all doctors for today.

**Auth:** RECEPTIONIST

**Response (200):**
```json
{
  "appointments": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "patientId": {
        "name": "John Doe",
        "phone": "1234567890"
      },
      "doctorId": {
        "userId": {
          "name": "Dr. Jane Smith",
          "specialization": "Cardiology"
        }
      },
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "10:30",
      "status": "BOOKED"
    }
  ],
  "stats": {
    "total": 15,
    "booked": 8,
    "seen": 5,
    "prescriptionDone": 2,
    "rescheduleRequired": 0
  }
}
```

---

### 14. Reschedule Appointment
**PUT** `/appointments/reschedule/:id`

Reschedule an existing appointment.

**Auth:** RECEPTIONIST

**Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
{
  "date": "2024-01-22T00:00:00.000Z",
  "timeSlot": "11:00"
}
```

**Response (200):**
```json
{
  "message": "Appointment rescheduled successfully",
  "appointment": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "date": "2024-01-22T00:00:00.000Z",
    "timeSlot": "11:00",
    "status": "BOOKED"
  }
}
```

**Errors:**
- `400`: Doctor not available on new date
- `404`: Appointment not found
- `409`: New slot already booked

---

### 15. Mark Appointment as Seen
**PUT** `/appointments/:id/mark-seen`

Mark an appointment as seen by doctor.

**Auth:** DOCTOR

**Parameters:**
- `id`: Appointment ID

**Response (200):**
```json
{
  "message": "Appointment marked as seen",
  "appointment": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "status": "SEEN"
  }
}
```

**Errors:**
- `400`: Already marked as seen
- `403`: Not your appointment
- `404`: Appointment not found

---

### 16. Get Pending Prescriptions
**GET** `/appointments/reception/pending-prescriptions`

Get appointments marked as SEEN but without prescriptions.

**Auth:** RECEPTIONIST

**Response (200):**
```json
{
  "appointments": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "patientId": {
        "name": "John Doe",
        "phone": "1234567890"
      },
      "doctorId": {
        "userId": {
          "name": "Dr. Jane Smith"
        }
      },
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "10:30",
      "status": "SEEN"
    }
  ],
  "total": 3
}
```

---

## 👨‍⚕️ Doctor Endpoints

### 17. Get Doctor Profile
**GET** `/doctors/profile`

Get logged-in doctor's profile.

**Auth:** DOCTOR

**Response (200):**
```json
{
  "doctor": {
    "id": "60d5ec49f1b2c72b8c8e4f1b",
    "user": {
      "name": "Dr. Jane Smith",
      "email": "jane@clinic.com",
      "phone": "9876543210"
    },
    "specialization": "Cardiology",
    "workingDays": ["Monday", "Tuesday", "Wednesday"],
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 15,
    "leaves": []
  }
}
```

---

### 18. Get Today's Appointments (Doctor)
**GET** `/doctors/appointments/today`

Get today's appointments for logged-in doctor.

**Auth:** DOCTOR

**Response:** Same as endpoint #12

---

### 19. Mark Appointment as Seen (Doctor)
**PUT** `/doctors/appointments/:id/seen`

Mark appointment as seen.

**Auth:** DOCTOR

**Response:** Same as endpoint #15

---

### 20. Request Emergency Leave
**POST** `/doctors/emergency-leave`

Request emergency leave and mark appointments for rescheduling.

**Auth:** DOCTOR

**Request Body:**
```json
{
  "date": "2024-01-20T00:00:00.000Z",
  "afterAppointments": 2
}
```

**Note:** Allows first N appointments, marks rest as RESCHEDULE_REQUIRED.

**Response (200):**
```json
{
  "message": "Emergency leave processed successfully",
  "allowedCount": 2,
  "rescheduledCount": 5
}
```

---

## 💊 Prescription Endpoints

### 21. Get Pending Prescriptions
**GET** `/prescriptions/pending`

Get appointments needing prescriptions (status: SEEN).

**Auth:** RECEPTIONIST

**Response (200):**
```json
{
  "appointments": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "patientId": {
        "name": "John Doe",
        "phone": "1234567890"
      },
      "status": "SEEN",
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "10:30"
    }
  ],
  "total": 3
}
```

---

### 22. Create Prescription
**POST** `/prescriptions`

Create a prescription for an appointment.

**Auth:** RECEPTIONIST

**Request Body:**
```json
{
  "appointmentId": "60d5ec49f1b2c72b8c8e4f1c",
  "medicines": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "duration": "7 days"
    },
    {
      "name": "Paracetamol",
      "dosage": "650mg",
      "duration": "3 days"
    }
  ],
  "tests": ["Blood Test", "X-Ray"],
  "notes": "Take medicine after meals. Rest for 3 days.",
  "followUpDate": "2024-01-25T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "message": "Prescription created successfully",
  "prescription": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "appointmentId": {
      "patientId": {
        "name": "John Doe"
      },
      "status": "PRESCRIPTION_DONE"
    },
    "medicines": [...],
    "tests": [...],
    "notes": "Take medicine after meals...",
    "followUpDate": "2024-01-25T00:00:00.000Z",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Appointment not marked as SEEN
- `404`: Appointment not found
- `409`: Prescription already exists

---

### 23. Get Patient Prescriptions
**GET** `/prescriptions/patient/:id`

Get all prescriptions for a patient.

**Auth:** Any authenticated user (patients can only view their own)

**Parameters:**
- `id`: Patient User ID

**Response (200):**
```json
{
  "prescriptions": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "appointmentId": {
        "date": "2024-01-15T00:00:00.000Z",
        "timeSlot": "10:30",
        "doctorId": {
          "userId": {
            "name": "Dr. Jane Smith",
            "specialization": "Cardiology"
          }
        }
      },
      "medicines": [...],
      "tests": [...],
      "notes": "...",
      "followUpDate": "2024-01-25T00:00:00.000Z",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "total": 5
}
```

**Errors:**
- `403`: Unauthorized to view other patient's prescriptions

---

## 🏥 Patient Endpoints

### 24. Get Patient Profile
**GET** `/patients/profile`

Get logged-in patient's profile. Auto-creates if doesn't exist.

**Auth:** PATIENT

**Response (200):**
```json
{
  "patient": {
    "_id": "60d5ec49f1b2c72b8c8e4f1e",
    "userId": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "age": 30,
    "gender": "Male",
    "bloodGroup": "O+",
    "allergies": ["Penicillin", "Peanuts"],
    "chronicDiseases": ["Diabetes"],
    "medicalHistory": [
      {
        "condition": "Hypertension",
        "diagnosedDate": "2022-05-10T00:00:00.000Z",
        "notes": "Controlled with medication",
        "isChronic": true
      }
    ],
    "medicalFiles": [
      {
        "fileName": "blood-test-2024.pdf",
        "fileUrl": "uploads/blood-test-1234567890.pdf",
        "fileType": "application/pdf",
        "uploadedAt": "2024-01-10T00:00:00.000Z"
      }
    ],
    "lastSummaryGeneratedAt": "2024-01-14T00:00:00.000Z"
  }
}
```

---

### 25. Update Medical Information
**PUT** `/patients/medical-info`

Update patient's medical information.

**Auth:** PATIENT

**Request Body:**
```json
{
  "age": 30,
  "gender": "Male",
  "bloodGroup": "O+",
  "allergies": ["Penicillin", "Peanuts"],
  "chronicDiseases": ["Diabetes", "Hypertension"],
  "medicalHistory": [
    {
      "condition": "Hypertension",
      "diagnosedDate": "2022-05-10T00:00:00.000Z",
      "notes": "Controlled with medication",
      "isChronic": true
    }
  ]
}
```

**Note:** All fields are optional. Only send fields you want to update.

**Response (200):**
```json
{
  "message": "Medical information updated successfully",
  "patient": { ... }
}
```

**Errors:**
- `400`: Invalid age, gender, or blood group

---

### 26. Upload Medical File
**POST** `/patients/upload`

Upload medical documents/reports.

**Auth:** PATIENT

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload (PDF, JPG, PNG, DOCX)

**Response (200):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "fileName": "blood-test.pdf",
    "fileType": "application/pdf",
    "fileSize": 245678
  }
}
```

**Errors:**
- `400`: Invalid file type or size > 10MB

---

## 🤖 AI Endpoints

### 27. Get Medical Summary
**GET** `/ai/summary/:patientId`

Generate AI-powered medical summary for a patient.

**Auth:** DOCTOR only

**Parameters:**
- `patientId`: Patient's ID (not User ID, but Patient collection ID)

**Response (200):**
```json
{
  "summary": {
    "critical_alerts": ["Diabetes Type 2 - requires monitoring"],
    "allergy_risk": ["Penicillin allergy - avoid related antibiotics"],
    "chronic_conditions": ["Diabetes", "Hypertension"],
    "visit_pattern_summary": "Patient has visited 5 times in last 6 months",
    "doctor_brief": "30-year-old male with well-controlled diabetes and hypertension. Recent blood work shows stable glucose levels."
  },
  "patientInfo": {
    "name": "John Doe",
    "age": 30,
    "bloodGroup": "O+",
    "totalVisits": 5
  }
}
```

**Errors:**
- `403`: Not a doctor
- `404`: Patient not found
- `500`: OpenAI API error

---

## 🔒 Authorization Matrix

| Endpoint | PATIENT | DOCTOR | RECEPTIONIST | SUPER_DOCTOR |
|----------|---------|--------|--------------|--------------|
| Register | ✅ | ❌ | ❌ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Google OAuth | ✅ | ❌ | ❌ | ❌ |
| Create Staff | ❌ | ❌ | ❌ | ✅ |
| Get Staff | ❌ | ❌ | ❌ | ✅ |
| Delete Staff | ❌ | ❌ | ❌ | ✅ |
| Book Appointment | ✅ | ❌ | ✅ | ❌ |
| View Available Slots | ✅ | ✅ | ✅ | ✅ |
| Doctor's Appointments | ❌ | ✅ | ❌ | ✅ |
| Reception Appointments | ❌ | ❌ | ✅ | ❌ |
| Reschedule Appointment | ❌ | ❌ | ✅ | ❌ |
| Mark as Seen | ❌ | ✅ | ❌ | ✅ |
| Emergency Leave | ❌ | ✅ | ❌ | ✅ |
| Create Prescription | ❌ | ❌ | ✅ | ❌ |
| View Prescriptions | ✅ | ✅ | ✅ | ✅ |
| Patient Profile | ✅ | ❌ | ❌ | ❌ |
| Upload Files | ✅ | ❌ | ❌ | ❌ |
| AI Summary | ❌ | ✅ | ❌ | ✅ |

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: "PATIENT" | "DOCTOR" | "RECEPTIONIST"
}
```

### Doctor
```javascript
{
  userId: ObjectId (ref: User),
  specialization: String,
  workingDays: [String],
  startTime: String,
  endTime: String,
  slotDuration: Number,
  isSuperDoctor: Boolean,
  leaves: [LeaveSchema]
}
```

### Patient
```javascript
{
  userId: ObjectId (ref: User),
  age: Number,
  gender: String,
  bloodGroup: String,
  allergies: [String],
  chronicDiseases: [String],
  medicalHistory: [MedicalHistorySchema],
  medicalFiles: [MedicalFileSchema],
  lastSummaryGeneratedAt: Date
}
```

### Appointment
```javascript
{
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: Doctor),
  date: Date,
  timeSlot: String,
  status: "BOOKED" | "SEEN" | "PRESCRIPTION_DONE" | "RESCHEDULE_REQUIRED"
}
```

### Prescription
```javascript
{
  appointmentId: ObjectId (ref: Appointment),
  medicines: [{ name, dosage, duration }],
  tests: [String],
  notes: String,
  followUpDate: Date
}
```

## 🧪 Testing

### Test Super Doctor Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superdoctor@niram.com",
  "password": "super123"
}
```

### Test Patient Registration
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Patient",
  "email": "patient@test.com",
  "phone": "1234567890",
  "password": "test123"
}
```

### Test Google OAuth
Open in browser:
```
http://localhost:5000/api/auth/google
```

## 📝 Notes

- All authenticated requests require JWT cookie (set automatically on login)
- Use `credentials: 'include'` in frontend fetch requests
- File uploads limited to 10MB
- Supported file types: PDF, JPG, PNG, DOCX, DICOM
- OpenAI API required for AI summaries
- Google OAuth creates users as PATIENT role by default

## 🚀 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=strong-random-secret-minimum-32-chars
OPENAI_API_KEY=your-openai-api-key
SESSION_SECRET=strong-random-session-secret
GOOGLE_CLIENT_ID=production-client-id
GOOGLE_CLIENT_SECRET=production-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET and SESSION_SECRET
- [ ] Configure CORS for specific domains
- [ ] Enable MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Enable helmet.js for security headers
- [ ] Set up monitoring and logging

## 📄 License

MIT

## 👨‍💻 Author

NIRAM AI Development Team

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

**Note:** This system is designed for educational purposes. Ensure compliance with healthcare data protection regulations (HIPAA, GDPR) before using in production.
