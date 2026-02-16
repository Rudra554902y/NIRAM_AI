# NIRAM AI Backend API Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Appointments](#appointments)
  - [Doctors](#doctors)
  - [Patients](#patients)
  - [Prescriptions](#prescriptions)
  - [Staff Management](#staff-management)
  - [Follow-ups](#follow-ups)
  - [AI Services](#ai-services)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)

---

## 🎯 Overview

NIRAM AI is a comprehensive hospital management system with advanced features including:
- Dual-token authentication (Access & Refresh tokens)
- Role-based access control (Patient, Doctor, Receptionist, Super Doctor)
- Online payment integration (Razorpay)
- AI-powered medical summaries (OpenAI)
- Automated follow-up management
- Emergency leave handling
- Appointment scheduling with slot management

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.2.1
- **Authentication**: JWT (jsonwebtoken), Passport.js (Google OAuth)
- **Payment**: Razorpay 2.9.6
- **AI**: OpenAI 4.77.0
- **Email**: Nodemailer 8.0.1
- **File Upload**: Multer 1.4.5-lts.1
- **Scheduling**: Node-cron 4.2.1
- **Security**: bcryptjs, cookie-parser

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payments)
- OpenAI API key (for AI features)

### Installation Steps

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (see Environment Variables section)
cp .env.example .env

# 4. Seed the database (optional - creates super doctor)
node seed.js

# 5. Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will start at `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/niram-ai

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here

# Token Expiration
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
PATIENT_DASHBOARD_URL=http://localhost:3000/patient/dashboard

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Secret
SESSION_SECRET=your_session_secret_key

# Razorpay Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Receptionist Contact
RECEPTIONIST_PHONE=+1-800-NIRAM-AI
```

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (unique),
  phone: String (unique),
  password: String (required, hashed),
  role: String (enum: ["DOCTOR", "RECEPTIONIST", "PATIENT"]),
  refreshToken: String,
  timestamps: true
}
```

### Patient Model
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  age: Number,
  gender: String,
  bloodGroup: String,
  allergies: [String],
  chronicDiseases: [String],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String,
    isChronic: Boolean
  }],
  medicalFiles: [{
    fileUrl: String,
    fileName: String,
    fileType: String,
    uploadedAt: Date
  }],
  lastSummaryGeneratedAt: Date,
  timestamps: true
}
```

### Doctor Model
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  specialization: String (required),
  workingDays: [String] (default: Mon-Fri),
  startTime: String (default: "09:00"),
  endTime: String (default: "17:00"),
  slotDuration: Number (default: 15 minutes),
  consultationFee: Number (required),
  isSuperDoctor: Boolean (default: false),
  leaves: [{
    type: String (enum: ["PLANNED", "EMERGENCY"]),
    date: Date,
    emergencyAfterAppointments: Number,
    status: String
  }],
  timestamps: true
}
```

### Appointment Model
```javascript
{
  patientId: ObjectId (ref: User, required),
  doctorId: ObjectId (ref: Doctor, required),
  date: Date (required),
  timeSlot: String (required),
  type: String (enum: ["NEW", "FOLLOW_UP"], default: "NEW"),
  status: String (enum: ["BOOKED", "SEEN", "PRESCRIPTION_DONE", "RESCHEDULE_REQUIRED", "NO_SHOW", "CANCELLED"]),
  symptoms: String,
  paymentMethod: String (enum: ["ONLINE", "CASH"]),
  paymentStatus: String (enum: ["PENDING", "PAID", "CASH_PENDING"]),
  confirmationStatus: String (enum: ["NOT_CONFIRMED", "CONFIRMED"]),
  rescheduledFrom: ObjectId (ref: Appointment),
  rescheduleReason: String,
  timestamps: true
}
```

### Prescription Model
```javascript
{
  appointmentId: ObjectId (ref: Appointment, required, unique),
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  tests: [{
    name: String,
    notes: String
  }],
  notes: String,
  followUpDate: Date,
  timestamps: true
}
```

### FollowUp Model
```javascript
{
  originalAppointmentId: ObjectId (ref: Appointment, required),
  patientId: ObjectId (ref: User, required),
  doctorId: ObjectId (ref: Doctor, required),
  recommendedDate: Date (required),
  status: String (enum: ["PENDING", "CONFIRMED", "DECLINED", "EXPIRED", "MISSED"]),
  followUpAppointmentId: ObjectId (ref: Appointment),
  responseAt: Date,
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

## 🔑 Authentication

All authentication endpoints use HTTP-only cookies for storing tokens.

### 1. Register Patient
**POST** `/api/auth/register`

**Access**: Public

**Purpose**: Register a new patient account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "PATIENT"
  }
}
```

**Cookies Set**:
- `accessToken` (15 minutes)
- `refreshToken` (7 days)

---

### 2. Login
**POST** `/api/auth/login`

**Access**: Public

**Purpose**: Login for all roles (Patient, Doctor, Receptionist).

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  }
}
```

**Cookies Set**:
- `accessToken` (15 minutes)
- `refreshToken` (7 days)

---

### 3. Logout
**POST** `/api/auth/logout`

**Access**: Public

**Purpose**: Logout user and clear authentication cookies.

**Request Body**: None

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

### 4. Refresh Access Token
**POST** `/api/auth/refresh`

**Access**: Public (requires refreshToken cookie)

**Purpose**: Get a new access token using refresh token.

**Request Body**: None (uses cookie)

**Response** (200):
```json
{
  "message": "Access token refreshed successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  }
}
```

---

### 5. Get Current User
**GET** `/api/auth/me`

**Authentication**: Required

**Purpose**: Get current authenticated user details.

**Request Body**: None

**Response** (200):
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "PATIENT",
    "createdAt": "2026-02-15T10:30:00.000Z",
    "updatedAt": "2026-02-15T10:30:00.000Z"
  }
}
```

---

### 6. Google OAuth Login
**GET** `/api/auth/google`

**Access**: Public

**Purpose**: Initiate Google OAuth login flow.

**Request Body**: None

**Response**: Redirects to Google OAuth consent screen

---

### 7. Google OAuth Callback
**GET** `/api/auth/google/callback`

**Access**: Public (OAuth)

**Purpose**: Handle Google OAuth callback and set tokens.

**Request Body**: None (handled by passport)

**Response**: Redirects to frontend dashboard with cookies set

---

## 📅 Appointments

### 1. Get Available Slots
**GET** `/api/appointments/available-slots`

**Authentication**: Required

**Purpose**: Get available appointment slots for a specific doctor on a specific date.

**Query Parameters**:
- `doctorId` (required): MongoDB ObjectId of the doctor
- `date` (required): Date in ISO format (YYYY-MM-DD)

**Example**: `/api/appointments/available-slots?doctorId=507f1f77bcf86cd799439011&date=2026-02-20`

**Response** (200):
```json
{
  "slots": [
    "09:00",
    "09:15",
    "09:30",
    "10:00",
    "11:15"
  ],
  "total": 5
}
```

---

### 2. Create Payment Order
**POST** `/api/appointments/payment/create`

**Authentication**: Required

**Authorization**: PATIENT only

**Purpose**: Create a Razorpay payment order for online appointment booking.

**Request Body**:
```json
{
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2026-02-20",
  "timeSlot": "09:00",
  "symptoms": "Fever and cough"
}
```

**Response** (200):
```json
{
  "orderId": "order_NhI6gXJfEtnBqk",
  "amount": 50000,
  "currency": "INR",
  "consultationFee": 500,
  "doctorName": "Dr. Smith",
  "receipt": "apt_1708004400000_507f1f77bcf86cd799439011"
}
```

---

### 3. Verify Payment and Book Appointment
**POST** `/api/appointments/payment/verify`

**Authentication**: Required

**Authorization**: PATIENT only

**Purpose**: Verify Razorpay payment and create confirmed appointment.

**Request Body**:
```json
{
  "orderId": "order_NhI6gXJfEtnBqk",
  "paymentId": "pay_NhI7BoXJafEtnBqk",
  "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2026-02-20",
  "timeSlot": "09:00",
  "symptoms": "Fever and cough"
}
```

**Response** (201):
```json
{
  "message": "Payment verified and appointment confirmed",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "patientId": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "name": "Dr. Smith",
        "specialization": "Cardiologist"
      }
    },
    "date": "2026-02-20T00:00:00.000Z",
    "timeSlot": "09:00",
    "type": "NEW",
    "status": "BOOKED",
    "symptoms": "Fever and cough",
    "paymentMethod": "ONLINE",
    "paymentStatus": "PAID",
    "confirmationStatus": "CONFIRMED"
  },
  "paymentId": "pay_NhI7BoXJafEtnBqk"
}
```

---

### 4. Book Appointment (Cash Payment)
**POST** `/api/appointments`

**Authentication**: Required

**Authorization**: RECEPTIONIST or PATIENT

**Purpose**: Book an appointment with cash payment (confirmation at reception).

**Request Body**:
```json
{
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2026-02-20",
  "timeSlot": "09:00",
  "paymentMethod": "CASH",
  "symptoms": "Routine checkup"
}
```

**Response** (201):
```json
{
  "message": "Appointment created. Please pay at reception for confirmation.",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "patientId": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "name": "Dr. Smith",
        "specialization": "Cardiologist"
      }
    },
    "date": "2026-02-20T00:00:00.000Z",
    "timeSlot": "09:00",
    "status": "BOOKED",
    "paymentMethod": "CASH",
    "paymentStatus": "CASH_PENDING",
    "confirmationStatus": "NOT_CONFIRMED"
  }
}
```

---

### 5. Get Today's Appointments (Doctor)
**GET** `/api/appointments/doctor/today`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Get all today's appointments for the logged-in doctor.

**Request Body**: None

**Response** (200):
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "patientId": {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
      },
      "timeSlot": "09:00",
      "status": "BOOKED",
      "symptoms": "Fever and cough",
      "type": "NEW"
    }
  ],
  "total": 1,
  "booked": 1,
  "seen": 0
}
```

---

### 6. Get Today's Appointments (Reception)
**GET** `/api/appointments/reception/today`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Get all today's appointments across all doctors.

**Request Body**: None

**Response** (200):
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "patientId": {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
      },
      "doctorId": {
        "_id": "507f1f77bcf86cd799439011",
        "userId": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        }
      },
      "timeSlot": "09:00",
      "status": "BOOKED",
      "paymentStatus": "CASH_PENDING",
      "confirmationStatus": "NOT_CONFIRMED"
    }
  ],
  "stats": {
    "total": 10,
    "booked": 6,
    "seen": 3,
    "prescriptionDone": 1,
    "rescheduleRequired": 0
  }
}
```

---

### 7. Get All Appointments with Filters (Reception)
**GET** `/api/appointments/reception/all`

**Authentication**: Required

**Authorization**: RECEPTIONIST or SUPER_DOCTOR

**Purpose**: Get all appointments with optional filters.

**Query Parameters** (all optional):
- `date`: Filter by specific date (YYYY-MM-DD)
- `status`: Filter by status (BOOKED, SEEN, PRESCRIPTION_DONE, etc.)
- `paymentStatus`: Filter by payment status (PENDING, PAID, CASH_PENDING)
- `confirmationStatus`: Filter by confirmation (NOT_CONFIRMED, CONFIRMED)

**Example**: `/api/appointments/reception/all?date=2026-02-20&status=BOOKED`

**Response** (200):
```json
{
  "appointments": [ /* array of appointments */ ],
  "stats": {
    "total": 25,
    "byStatus": {
      "booked": 10,
      "seen": 8,
      "prescriptionDone": 5,
      "rescheduleRequired": 1,
      "noShow": 1,
      "cancelled": 0
    },
    "byPaymentStatus": {
      "pending": 2,
      "paid": 20,
      "cashPending": 3
    },
    "byConfirmationStatus": {
      "notConfirmed": 3,
      "confirmed": 22
    }
  }
}
```

---

### 8. Reschedule Appointment
**PUT** `/api/appointments/:id/reschedule`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Reschedule an existing appointment to a new date and time.

**URL Parameters**:
- `id`: Appointment ID

**Request Body**:
```json
{
  "date": "2026-02-25",
  "timeSlot": "10:00",
  "rescheduleReason": "Doctor emergency leave"
}
```

**Response** (200):
```json
{
  "message": "Appointment rescheduled successfully",
  "oldAppointment": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "RESCHEDULE_REQUIRED"
  },
  "newAppointment": {
    "_id": "507f1f77bcf86cd799439023",
    "date": "2026-02-25T00:00:00.000Z",
    "timeSlot": "10:00",
    "status": "BOOKED",
    "rescheduledFrom": "507f1f77bcf86cd799439012"
  }
}
```

---

### 9. Mark Appointment as No-Show
**PUT** `/api/appointments/:id/no-show`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Mark an appointment as no-show when patient doesn't arrive.

**URL Parameters**:
- `id`: Appointment ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "Appointment marked as no-show",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "NO_SHOW"
  },
  "followUpUpdated": false
}
```

---

### 10. Confirm Cash Payment
**PUT** `/api/appointments/:id/confirm-cash`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Confirm cash payment received at reception.

**URL Parameters**:
- `id`: Appointment ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "Cash payment confirmed",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "paymentStatus": "PAID",
    "confirmationStatus": "CONFIRMED"
  }
}
```

---

### 11. Mark Appointment as Seen
**PUT** `/api/appointments/:id/mark-seen`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Mark appointment as seen after doctor consultation.

**URL Parameters**:
- `id`: Appointment ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "Appointment marked as seen",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "SEEN"
  }
}
```

---

## 👨‍⚕️ Doctors

### 1. Get Public Doctor List
**GET** `/api/doctors/list`

**Access**: Public (No authentication required)

**Purpose**: Get list of all doctors with their schedules and fees (for booking page).

**Request Body**: None

**Response** (200):
```json
{
  "doctors": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Dr. Smith",
      "specialization": "Cardiologist",
      "consultationFee": 500,
      "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "slotDuration": 15,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "total": 5
}
```

---

### 2. Get Doctor Profile
**GET** `/api/doctors/profile`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Get logged-in doctor's profile and schedule details.

**Request Body**: None

**Response** (200):
```json
{
  "doctor": {
    "id": "507f1f77bcf86cd799439011",
    "user": {
      "name": "Dr. Smith",
      "email": "smith@hospital.com",
      "phone": "+1234567890"
    },
    "specialization": "Cardiologist",
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "startTime": "09:00",
    "endTime": "17:00",
    "slotDuration": 15,
    "leaves": []
  }
}
```

---

### 3. Get Today's Appointments (Doctor)
**GET** `/api/doctors/appointments/today`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Get all today's appointments for logged-in doctor.

**Request Body**: None

**Response** (200):
```json
{
  "appointments": [ /* array of appointments */ ],
  "total": 8,
  "booked": 5,
  "seen": 3
}
```

---

### 4. Mark Appointment as Seen (Doctor)
**PUT** `/api/doctors/appointments/:id/seen`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Mark appointment as seen after consultation.

**URL Parameters**:
- `id`: Appointment ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "Appointment marked as seen",
  "appointment": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "SEEN"
  }
}
```

---

### 5. Mark Emergency Leave
**POST** `/api/doctors/emergency-leave`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Mark emergency leave and reschedule appointments after specified count.

**Request Body**:
```json
{
  "date": "2026-02-20",
  "afterAppointments": 5
}
```

**Response** (200):
```json
{
  "message": "Emergency leave processed successfully",
  "allowedCount": 5,
  "rescheduledCount": 3
}
```

---

## 🏥 Patients

### 1. Get Patient Profile
**GET** `/api/patients/profile`

**Authentication**: Required

**Authorization**: PATIENT only

**Purpose**: Get logged-in patient's medical profile.

**Request Body**: None

**Response** (200):
```json
{
  "patient": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "age": 35,
    "gender": "Male",
    "bloodGroup": "O+",
    "allergies": ["Penicillin"],
    "chronicDiseases": ["Hypertension"],
    "medicalHistory": [
      {
        "condition": "Diabetes Type 2",
        "diagnosedDate": "2020-05-15T00:00:00.000Z",
        "notes": "Controlled with medication",
        "isChronic": true
      }
    ],
    "medicalFiles": []
  }
}
```

---

### 2. Update Medical Information
**PUT** `/api/patients/medical-info`

**Authentication**: Required

**Authorization**: PATIENT only

**Purpose**: Update patient's medical information.

**Request Body** (all fields optional):
```json
{
  "age": 36,
  "gender": "Male",
  "bloodGroup": "O+",
  "allergies": ["Penicillin", "Aspirin"],
  "chronicDiseases": ["Hypertension", "Diabetes"],
  "medicalHistory": [
    {
      "condition": "Diabetes Type 2",
      "diagnosedDate": "2020-05-15",
      "notes": "Controlled with medication",
      "isChronic": true
    }
  ]
}
```

**Response** (200):
```json
{
  "message": "Medical information updated successfully",
  "patient": { /* updated patient object */ }
}
```

---

### 3. Upload Medical File
**POST** `/api/patients/upload`

**Authentication**: Required

**Authorization**: PATIENT only

**Purpose**: Upload medical documents/reports (PDF, images).

**Request**: Multipart form-data
- `file`: File upload (max 10MB)

**Allowed File Types**:
- PDF
- JPEG/JPG/PNG images
- DICOM
- DOC/DOCX

**Response** (200):
```json
{
  "message": "File uploaded successfully",
  "file": {
    "fileName": "blood_report.pdf",
    "fileType": "application/pdf",
    "fileSize": 245678
  }
}
```

---

## 💊 Prescriptions

### 1. Get Pending Prescriptions
**GET** `/api/prescriptions/pending`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Get appointments marked as SEEN but without prescriptions yet.

**Request Body**: None

**Response** (200):
```json
{
  "appointments": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "patientId": {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com"
      },
      "doctorId": {
        "_id": "507f1f77bcf86cd799439011",
        "userId": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        }
      },
      "date": "2026-02-20T00:00:00.000Z",
      "timeSlot": "09:00",
      "status": "SEEN"
    }
  ],
  "total": 3
}
```

---

### 2. Create Prescription
**POST** `/api/prescriptions`

**Authentication**: Required

**Authorization**: RECEPTIONIST only

**Purpose**: Create prescription for a SEEN appointment (receptionist enters doctor's prescription).

**Request Body**:
```json
{
  "appointmentId": "507f1f77bcf86cd799439012",
  "medicines": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    },
    {
      "name": "Paracetamol",
      "dosage": "650mg",
      "frequency": "As needed",
      "duration": "5 days"
    }
  ],
  "tests": [
    {
      "name": "Blood Sugar Test",
      "notes": "Fasting required"
    }
  ],
  "notes": "Rest for 3 days. Avoid cold water.",
  "followUpDate": "2026-03-05"
}
```

**Response** (201):
```json
{
  "message": "Prescription created successfully",
  "prescription": {
    "_id": "507f1f77bcf86cd799439024",
    "appointmentId": {
      "_id": "507f1f77bcf86cd799439012",
      "patientId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "doctorId": {
        "userId": {
          "name": "Dr. Smith"
        }
      },
      "status": "PRESCRIPTION_DONE"
    },
    "medicines": [ /* medicines array */ ],
    "tests": [ /* tests array */ ],
    "notes": "Rest for 3 days. Avoid cold water.",
    "followUpDate": "2026-03-05T00:00:00.000Z"
  }
}
```

**Note**: If `followUpDate` is provided, system automatically:
- Creates a FollowUp record
- Sends email notification to patient
- Sends SMS notification to patient

---

### 3. Get Patient Prescriptions
**GET** `/api/prescriptions/patient/:id`

**Authentication**: Required

**Authorization**: Any authenticated user (patients can only view their own)

**Purpose**: Get all prescriptions for a specific patient.

**URL Parameters**:
- `id`: Patient User ID

**Request Body**: None

**Response** (200):
```json
{
  "prescriptions": [
    {
      "_id": "507f1f77bcf86cd799439024",
      "appointmentId": {
        "_id": "507f1f77bcf86cd799439012",
        "date": "2026-02-20T00:00:00.000Z",
        "timeSlot": "09:00",
        "doctorId": {
          "userId": {
            "name": "Dr. Smith",
            "specialization": "Cardiologist"
          }
        }
      },
      "medicines": [ /* medicines array */ ],
      "tests": [ /* tests array */ ],
      "notes": "Rest for 3 days. Avoid cold water.",
      "followUpDate": "2026-03-05T00:00:00.000Z",
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 👥 Staff Management

**Note**: All staff management endpoints require SUPER_DOCTOR role.

### 1. Create Staff
**POST** `/api/staff/create`

**Authentication**: Required

**Authorization**: SUPER_DOCTOR only

**Purpose**: Create new staff members (doctors or receptionists).

**Request Body for Doctor**:
```json
{
  "name": "Dr. Jane Wilson",
  "email": "jane@hospital.com",
  "phone": "+1234567891",
  "password": "securePassword123",
  "role": "DOCTOR",
  "specialization": "Dermatologist",
  "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "startTime": "10:00",
  "endTime": "18:00",
  "slotDuration": 20,
  "consultationFee": 600
}
```

**Request Body for Receptionist**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@hospital.com",
  "phone": "+1234567892",
  "password": "securePassword123",
  "role": "RECEPTIONIST"
}
```

**Response** (201):
```json
{
  "message": "DOCTOR created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439025",
    "name": "Dr. Jane Wilson",
    "email": "jane@hospital.com",
    "phone": "+1234567891",
    "role": "DOCTOR"
  }
}
```

---

### 2. Get All Staff
**GET** `/api/staff`

**Authentication**: Required

**Authorization**: SUPER_DOCTOR only

**Purpose**: Get list of all staff members (doctors and receptionists).

**Request Body**: None

**Response** (200):
```json
{
  "staff": [
    {
      "id": "507f1f77bcf86cd799439025",
      "name": "Dr. Jane Wilson",
      "email": "jane@hospital.com",
      "phone": "+1234567891",
      "role": "DOCTOR",
      "doctorDetails": {
        "specialization": "Dermatologist",
        "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "startTime": "10:00",
        "endTime": "18:00",
        "slotDuration": 20,
        "consultationFee": 600,
        "isSuperDoctor": false
      },
      "createdAt": "2026-02-15T08:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439026",
      "name": "Alice Johnson",
      "email": "alice@hospital.com",
      "phone": "+1234567892",
      "role": "RECEPTIONIST",
      "doctorDetails": null,
      "createdAt": "2026-02-15T09:00:00.000Z"
    }
  ],
  "total": 2,
  "doctors": 1,
  "receptionists": 1
}
```

---

### 3. Delete Staff
**DELETE** `/api/staff/:id`

**Authentication**: Required

**Authorization**: SUPER_DOCTOR only

**Purpose**: Delete a staff member (doctor or receptionist).

**URL Parameters**:
- `id`: Staff User ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "DOCTOR deleted successfully"
}
```

**Note**: Cannot delete:
- Super Doctor
- Patients (must use different endpoint)

---

## 🔄 Follow-ups

### 1. Get Patient Follow-ups
**GET** `/api/followups/patient/:id`

**Authentication**: Required

**Authorization**: Any (patients can only view their own)

**Purpose**: Get all follow-up recommendations for a patient.

**URL Parameters**:
- `id`: Patient User ID

**Request Body**: None

**Response** (200):
```json
{
  "followUps": [
    {
      "_id": "507f1f77bcf86cd799439027",
      "originalAppointmentId": {
        "_id": "507f1f77bcf86cd799439012",
        "date": "2026-02-20T00:00:00.000Z",
        "timeSlot": "09:00"
      },
      "doctorId": {
        "_id": "507f1f77bcf86cd799439011",
        "userId": {
          "name": "Dr. Smith",
          "specialization": "Cardiologist"
        }
      },
      "recommendedDate": "2026-03-05T00:00:00.000Z",
      "status": "PENDING",
      "followUpAppointmentId": null,
      "responseAt": null,
      "createdAt": "2026-02-20T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

**Status Values**:
- `PENDING`: Awaiting patient response
- `CONFIRMED`: Patient confirmed and appointment created
- `DECLINED`: Patient declined follow-up
- `EXPIRED`: Follow-up expired (managed by cron job)
- `MISSED`: Confirmed but patient didn't show up

---

### 2. Confirm Follow-up
**POST** `/api/followups/:id/confirm`

**Authentication**: Required

**Purpose**: Confirm a follow-up and create an appointment.

**URL Parameters**:
- `id`: FollowUp ID

**Request Body**:
```json
{
  "date": "2026-03-05",
  "timeSlot": "10:00"
}
```

**Response** (201):
```json
{
  "message": "Follow-up confirmed and appointment created",
  "followUp": {
    "_id": "507f1f77bcf86cd799439027",
    "status": "CONFIRMED",
    "followUpAppointmentId": "507f1f77bcf86cd799439028",
    "responseAt": "2026-02-21T14:30:00.000Z"
  },
  "appointment": {
    "_id": "507f1f77bcf86cd799439028",
    "type": "FOLLOW_UP",
    "status": "BOOKED",
    "paymentStatus": "PAID",
    "confirmationStatus": "CONFIRMED",
    "date": "2026-03-05T00:00:00.000Z",
    "timeSlot": "10:00"
  }
}
```

**Note**: Follow-up appointments are automatically marked as PAID (free or covered by initial consultation).

---

### 3. Decline Follow-up
**PUT** `/api/followups/:id/decline`

**Authentication**: Required

**Purpose**: Decline a follow-up recommendation.

**URL Parameters**:
- `id`: FollowUp ID

**Request Body**: None

**Response** (200):
```json
{
  "message": "Follow-up declined successfully",
  "followUp": {
    "_id": "507f1f77bcf86cd799439027",
    "status": "DECLINED",
    "responseAt": "2026-02-21T14:35:00.000Z"
  }
}
```

---

### 4. Get All Follow-ups (Admin)
**GET** `/api/followups/all`

**Authentication**: Required

**Authorization**: RECEPTIONIST or SUPER_DOCTOR

**Purpose**: Get all follow-ups with optional filters (admin view).

**Query Parameters** (all optional):
- `status`: Filter by status (PENDING, CONFIRMED, DECLINED, EXPIRED, MISSED)
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)

**Example**: `/api/followups/all?status=PENDING&startDate=2026-02-01&endDate=2026-02-28`

**Response** (200):
```json
{
  "followUps": [ /* array of follow-ups */ ],
  "total": 15
}
```

---

## 🤖 AI Services

### 1. Get Medical Summary
**GET** `/api/ai/summary/:patientId`

**Authentication**: Required

**Authorization**: DOCTOR only

**Purpose**: Generate AI-powered medical summary for a patient before consultation.

**URL Parameters**:
- `patientId`: Patient Model ID (not User ID)

**Request Body**: None

**Response** (200):
```json
{
  "summary": {
    "critical_alerts": [
      "Patient has severe penicillin allergy - avoid beta-lactam antibiotics"
    ],
    "allergy_risk": [
      "Penicillin - documented allergy",
      "Aspirin - sensitivity reported"
    ],
    "chronic_conditions": [
      "Type 2 Diabetes - controlled with Metformin",
      "Hypertension - on Amlodipine 5mg daily"
    ],
    "visit_pattern_summary": "8 visits in last 6 months. Last visit: prescribed antibiotics for respiratory infection. Patient consistently follows treatment plans.",
    "doctor_brief": "35yo male with controlled diabetes and hypertension. Routine monitoring required. Watch for drug allergies. Recent respiratory issues resolved."
  },
  "patientInfo": {
    "name": "John Doe",
    "age": 35,
    "bloodGroup": "O+",
    "totalVisits": 8
  }
}
```

**Uses**:
- Patient medical history
- Allergies and chronic diseases
- Previous prescription notes
- Visit patterns

**Models**: OpenAI GPT-4o-mini (configurable)

**Error Responses**:
- `500` - OpenAI API key not configured
- `503` - OpenAI API quota exceeded
- `500` - Invalid OpenAI API key

---

## 🔐 Authentication & Authorization

### Token System

The system uses a **dual-token authentication** approach:

1. **Access Token**:
   - Short-lived (15 minutes)
   - Used for API authentication
   - Stored in HTTP-only cookie
   - Verified on every protected endpoint

2. **Refresh Token**:
   - Long-lived (7 days)
   - Used to generate new access tokens
   - Stored in HTTP-only cookie
   - Stored in database for validation

### Protected Endpoints

All endpoints except the following require authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/doctors/list`

### Authorization Middleware

Request headers must include cookies:
```
Cookie: accessToken=<jwt_token>; refreshToken=<jwt_token>
```

### Role-Based Access Control

| Role | Access |
|------|--------|
| **PATIENT** | Patient profile, own appointments, own prescriptions, follow-ups |
| **DOCTOR** | Doctor profile, own appointments, mark seen, emergency leave, AI summaries |
| **RECEPTIONIST** | All appointments, prescriptions management, payment confirmation, scheduling |
| **SUPER_DOCTOR** | All doctor privileges + staff management (create/delete staff) |

### Automatic Token Refresh

When access token expires:
1. Client receives `401` error
2. Client calls `/api/auth/refresh` with refresh token
3. New access token is issued
4. Client retries original request

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request (invalid input) |
| `401` | Unauthorized (authentication required) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource not found |
| `409` | Conflict (e.g., slot already booked, email exists) |
| `500` | Internal server error |
| `503` | Service unavailable (e.g., external API down) |

### Common Error Examples

**Invalid credentials**:
```json
{
  "error": "Invalid email or password"
}
```

**Missing authentication**:
```json
{
  "error": "User not authenticated"
}
```

**Insufficient permissions**:
```json
{
  "error": "Unauthorized to view other patient's prescriptions"
}
```

**Slot conflict**:
```json
{
  "error": "This slot is already booked"
}
```

**Validation error**:
```json
{
  "error": "Missing required fields: name, email, phone, password"
}
```

---

## 🔄 Background Jobs

### Follow-up Expiry Job

**Schedule**: Runs every day at midnight (00:00)

**Purpose**: Expire pending follow-ups that are 7+ days old without response.

**Implementation**: `src/jobs/followUpJob.js`

**Configuration**: Uses `node-cron`

---

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point
├── package.json             # Dependencies
├── seed.js                  # Database seeding
├── uploads/                 # Uploaded medical files
└── src/
    ├── app.js              # Express app configuration
    ├── config/
    │   ├── db.js           # MongoDB connection
    │   └── passport.js     # Passport OAuth config
    ├── controllers/
    │   ├── aiController.js
    │   ├── appointmentController.js
    │   ├── authController.js
    │   ├── doctorController.js
    │   ├── followUpController.js
    │   ├── patientController.js
    │   ├── prescriptionController.js
    │   └── staffController.js
    ├── middleware/
    │   ├── authMiddleware.js        # JWT authentication
    │   ├── roleMiddleware.js        # Role-based authorization
    │   ├── superDoctorMiddleware.js # Super doctor check
    │   └── uploadMiddleware.js      # Multer file upload
    ├── models/
    │   ├── Appointment.js
    │   ├── Doctor.js
    │   ├── FollowUp.js
    │   ├── Patient.js
    │   ├── Prescription.js
    │   └── User.js
    ├── routes/
    │   ├── aiRoutes.js
    │   ├── appointmentRoutes.js
    │   ├── authRoutes.js
    │   ├── doctorRoutes.js
    │   ├── followUpRoutes.js
    │   ├── patientRoutes.js
    │   ├── prescriptionRoutes.js
    │   └── staffRoutes.js
    ├── jobs/
    │   └── followUpJob.js          # Cron jobs
    └── utils/
        ├── notificationService.js  # Email/SMS
        ├── paymentService.js       # Razorpay integration
        ├── slotGenerator.js        # Time slot generation
        └── tokenUtils.js           # JWT utilities
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Seed database (creates super doctor)
node seed.js

# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev
```

---

## 🧪 Testing with Sample Data

After seeding, you can login with:

**Super Doctor**:
- Email: `superdoctor@hospital.com`
- Password: `super123`
- Role: DOCTOR (with isSuperDoctor: true)

**Create test users**:
1. Register as patient: `POST /api/auth/register`
2. Login as super doctor
3. Create staff: `POST /api/staff/create`

---

## 📝 Notes

1. **Security**:
   - All passwords are hashed with bcryptjs
   - JWT tokens are stored in HTTP-only cookies
   - CORS configured for localhost development
   - Sensitive data excluded from responses

2. **Payment Integration**:
   - Razorpay for online payments
   - Cash payment option with reception confirmation
   - Payment verification with signature validation

3. **File Uploads**:
   - Medical files stored in `uploads/` directory
   - Max file size: 10MB
   - Allowed: PDF, images, DICOM, DOC/DOCX

4. **Email/SMS**:
   - Nodemailer for email notifications
   - Twilio for SMS (commented in code, ready to use)
   - Follow-up reminders sent automatically

5. **AI Features**:
   - OpenAI GPT-4o-mini for medical summaries
   - Configurable API key
   - Graceful fallback on API errors

---

## 🆘 Support

For issues or questions:
- Check error logs in console
- Verify environment variables
- Ensure MongoDB is running
- Check API key configurations

---

**Last Updated**: February 15, 2026  
**Version**: 1.0.0  
**Author**: NIRAM AI Development Team
