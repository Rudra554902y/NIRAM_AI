# NIRAM Healthcare Workflow System

<div align="center">
  <h3>🏥 Next-Generation Healthcare Operating System</h3>
  <p>Bridging ancient Ayurvedic wisdom with modern precision for clinics that care</p>
  
  ![Version](https://img.shields.io/badge/version-1.0.0-emerald)
  ![React](https://img.shields.io/badge/React-18.3.1-61dafb)
  ![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff)
</div>

---

## 🎯 Overview

**NIRAM** is a comprehensive healthcare workflow management system designed for modern clinical practices. It combines role-based access control, intelligent appointment scheduling, digital prescription management, and real-time queue monitoring in a beautiful, responsive interface.

### Enterprise Edition v1.0
- ✅ Pure JavaScript React implementation
- ✅ Three role-based dashboards (Patient, Doctor, Receptionist)
- ✅ Schema-aligned data structures
- ✅ Modern SaaS-style UI
- ✅ Fully responsive design
- ✅ Mock authentication for preview

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## ✨ Features

### 🔐 Role-Based Access Control
- **Patient Dashboard** (`/patient`) - Book appointments, view prescriptions, health insights
- **Doctor Dashboard** (`/doctor`) - Manage schedule, create prescriptions, view patients
- **Receptionist Dashboard** (`/receptionist`) - Queue management, walk-in booking, patient registration

### 📅 Smart Scheduling
- Time slot management with conflict detection
- Multi-doctor schedule coordination
- Automated reminders (mock)

### 💊 Digital Prescriptions
- Medicine tracking with dosage
- Lab test recommendations
- Clinical notes and follow-up dates

### 🎭 Queue Management
- Real-time patient queue
- Check-in workflow
- Position tracking

---

## 📁 Project Structure

```
src/
  ├── App.jsx                 # Main app with routing
  ├── pages/
  │   ├── HomePage.jsx        # Landing page
  │   ├── auth/LoginPage.jsx  # Role selection
  │   ├── patient/            # Patient dashboard
  │   ├── doctor/             # Doctor dashboard
  │   └── reception/          # Receptionist dashboard
  ├── components/
  │   ├── layout/Layout.jsx   # Shared layout
  │   └── ui/                 # Reusable components
  └── services/mockData.js    # Schema-aligned data
```

---

## 👥 Preview Mode

The app uses **mock authentication**. Select any role on the login page and enter any access key to explore:

- **Patient** - Book appointments, view prescriptions
- **Doctor** - Manage consultations, create prescriptions
- **Receptionist** - Queue management, patient registration

---

## 📊 Data Schema

Aligned with system requirements:
- **User** - Base user entity with role
- **Doctor** - Specialization, working hours, slots
- **Appointment** - Patient-doctor bookings
- **Prescription** - Medicines, tests, notes
- **Reminder** - Automated notifications
- **Queue** - Real-time patient flow

See `src/services/mockData.js` for complete schema.

---

## 🛠️ Tech Stack

- **React 18.3.1** + **Vite 6.3.5**
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4.1** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Radix UI** - Accessible components
- **Sonner** - Toast notifications

---

## 📝 Documentation

- **README_UI_ASSETS.md** - Complete asset catalog with all icons, components, and usage patterns

---

## 🎨 Design System

### Colors
- Primary: Emerald (#10b981) / Teal (#14b8a6)
- Secondary: Blue (#3b82f6)
- Accent: Purple (#a855f7)
- Background: Dark slate (#020617)

### Components
- Card, Button, Badge, Modal (in `components/ui/`)
- Layout wrapper for dashboards
- Fully responsive and mobile-friendly

---

## 🚀 Deployment

Compatible with:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

---

## 📄 License

MIT License

---

## 🙏 Credits

Built with React, Vite, Tailwind CSS, and modern web technologies.

**NIRAM Healthcare Systems** • Enterprise Edition 2026

---

<div align="center">
  <p>Built with ❤️ for modern healthcare</p>
</div>

  