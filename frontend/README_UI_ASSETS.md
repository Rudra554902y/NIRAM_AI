# NIRAM UI Assets Documentation

## Overview
This document catalogs all icons, images, and visual assets used in the NIRAM Healthcare Workflow System. All assets are organized by type and usage.

---

## 📦 Icon Library

### Primary Icon Source
**Library:** Lucide React (`lucide-react` package)
**Version:** 0.487.0
**Type:** SVG Icons as React Components
**Why:** Modern, consistent, tree-shakeable icon library with healthcare-friendly options

---

## 🎨 Icons by Category

### Navigation & Layout Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `Menu` | All Dashboards | Mobile navigation toggle |
| `X` | All Modals/Menus | Close buttons |
| `ChevronRight` | Multiple components | Navigation arrows |
| `ArrowRight` | HomePage, LoginPage | CTAs and forward actions |
| `ArrowLeft` | LoginPage | Back navigation |
| `LogOut` | Layout | Sign out button |

**Files Using These:**
- `src/components/layout/Layout.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/auth/LoginPage.jsx`

---

### Healthcare & Medical Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `Stethoscope` | PatientDashboard, ReceptionistDashboard, DoctorDashboard | Doctor representation |
| `Activity` | HomePage, PatientDashboard | Health insights/monitoring |
| `HeartPulse` | HomePage | Healthcare workflow |
| `Pill` | PatientDashboard, DoctorDashboard | Medicines/prescriptions |
| `TestTube` | PatientDashboard | Medical tests |

**Files Using These:**
- `src/pages/patient/PatientDashboard.jsx`
- `src/pages/doctor/DoctorDashboard.jsx`
- `src/pages/reception/ReceptionistDashboard.jsx`
- `src/pages/HomePage.jsx`

---

### User & Role Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `User` | LoginPage, PatientDashboard | Patient role indicator |
| `ShieldCheck` | LoginPage, HomePage, ReceptionistDashboard | Receptionist role & security |
| `Users` | ReceptionistDashboard, DoctorDashboard | Patients list/queue |
| `UserPlus` | ReceptionistDashboard | Register new patient |

**Files Using These:**
- `src/pages/auth/LoginPage.jsx`
- `src/pages/patient/PatientDashboard.jsx`
- `src/pages/reception/ReceptionistDashboard.jsx`

---

### Calendar & Scheduling Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `Calendar` | All Dashboards, HomePage | Appointments calendar |
| `CalendarCheck` | PatientDashboard | Appointment confirmation |
| `CalendarPlus` | ReceptionistDashboard | Book new appointment |
| `Clock` | All Dashboards | Time slots/duration |

**Files Using These:**
- `src/pages/patient/PatientDashboard.jsx`
- `src/pages/doctor/DoctorDashboard.jsx`
- `src/pages/reception/ReceptionistDashboard.jsx`
- `src/pages/HomePage.jsx`

---

### Document & Data Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `FileText` | PatientDashboard, DoctorDashboard | Prescriptions |
| `ClipboardList` | HomePage PatientDashboard | Digital prescriptions feature |
| `List` | ReceptionistDashboard | Queue list view |

**Files Using These:**
- `src/pages/patient/PatientDashboard.jsx`
- `src/pages/doctor/DoctorDashboard.jsx`
- `src/pages/reception/ReceptionistDashboard.jsx`
- `src/pages/HomePage.jsx`

---

### Status & Feedback Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `CheckCircle2` | PatientDashboard, DoctorDashboard | Completed status |
| `AlertCircle` | PatientDashboard, DoctorDashboard | Warnings/tips |
| `Plus` | All Dashboards | Add/create actions |
| `BellRing` | HomePage | Reminder feature |

**Files Using These:**
- `src/pages/patient/PatientDashboard.jsx`
- `src/pages/doctor/DoctorDashboard.jsx`
- `src/pages/reception/ReceptionistDashboard.jsx`
- `src/pages/HomePage.jsx`

---

### System & Settings Icons
| Icon | Component | Used In | Purpose |
|------|-----------|---------|---------|
| `Settings` | DoctorDashboard | Availability settings |
| `Shield` | HomePage | Security/RBAC feature |
| `KeyRound` | LoginPage | Access key input |
| `LogIn` | LoginPage | Login indicator |

**Files Using These:**
- `src/pages/auth/LoginPage.jsx`
- `src/pages/doctor/DoctorDashboard.jsx`
- `src/pages/HomePage.jsx`

---

## 🖼️ Images & Logos

### Brand Assets
| Asset | Type | Source | Used In | Purpose |
|-------|------|--------|---------|---------|
| NIRAM Logo | PNG | Figma Asset | LandingPage (old) | Brand identity |
| N Letter Logo | SVG (generated) | CSS Gradient Div | All pages | Simplified brand mark |

**Current Implementation:**
The project uses **CSS-generated logo** (letter "N" in a gradient box) instead of image files for better performance.

**Location:**
- All navigation headers and branding use `<div>` with gradient backgrounds
- No external image files for logos

**Gradient Definition:**
```css
bg-gradient-to-br from-emerald-500 to-teal-500
```

---

## 🎭 Background & Decorative Elements

### Background Patterns
| Element | Type | Used In | Purpose |
|---------|------|---------|---------|
| Carbon Fiber Pattern | External URL | HomePage (commented) | Subtle texture |
| Blur Gradients | CSS | All pages | Ambient lighting effect |

**Current Status:**
- Background textures are referenced but may link to external CDNs
- Uses CSS blur effects for ambient backgrounds

**Locations:**
- `src/pages/HomePage.jsx` - Animated gradient blurs
- `src/pages/auth/LoginPage.jsx` - Gradient effects
- All dashboard pages use similar ambient backgrounds

---

## 📊 Icon Usage Summary

### Total Unique Icons: 32

| Category | Count |
|----------|-------|
| Navigation & Layout | 6 |
| Healthcare & Medical | 5 |
| User & Role | 4 |
| Calendar & Scheduling | 4 |
| Document & Data | 3 |
| Status & Feedback | 4 |
| System & Settings | 4 |
| Others | 2 |

---

## 🚨 External Dependencies & CDN Links

### Identified External Assets
1. **Figma Assets** (Old implementation)
   - Pattern: `figma:asset/[hash].png`
   - Status: Removed in refactor
   - Replacement: CSS gradients

2. **Transparent Textures** (Optional)
   - URL: `https://www.transparenttextures.com/patterns/carbon-fibre.png`
   - Usage: Background texture (optional)
   - Status: Referenced but not critical

---

## 📁 Asset Organization

### Current Structure
```
src/
  ├── assets/                 # Empty (no image files used)
  ├── components/
  │   └── ui/                 # Icon components imported from lucide-react
  └── pages/                  # Icons used inline via imports
```

### Recommended Future Structure
```
src/
  ├── assets/
  │   ├── icons/             # Custom SVG icons (if needed)
  │   ├── images/            # Brand images, photos
  │   ├── illustrations/     # Healthcare illustrations
  │   └── brand/             # Logo variations
```

---

## 🎨 Color Palette for Icons

### Primary Colors
- **Emerald/Teal:** `#10b981` - Primary actions, health positivity
- **Blue/Cyan:** `#3b82f6` - Information, secondary actions
- **Purple/Pink:** `#a855f7` - Premium features, doctor role
- **Amber/Orange:** `#f59e0b` - Warnings, pending states
- **Red/Rose:** `#ef4444` - Errors, critical states

### Icon Color Classes
```css
.text-emerald-400  /* Primary health icons */
.text-blue-400     /* Info/system icons */
.text-purple-400   /* Premium/doctor icons */
.text-amber-400    /* Warning icons */
.text-red-400      /* Error/danger icons */
.text-slate-400    /* Neutral/inactive icons */
```

---

## 🔧 Implementation Notes

### Icon Import Pattern
```javascript
import { 
  IconName1, 
  IconName2 
} from 'lucide-react';
```

### Icon Usage Pattern
```jsx
<IconName className="w-5 h-5 text-emerald-400" />
```

### Standard Sizes
- **Small:** `w-4 h-4` (16px)
- **Medium:** `w-5 h-5` (20px)
- **Large:** `w-6 h-6` (24px)
- **XL:** `w-8 h-8` (32px)
- **2XL:** `w-12 h-12` (48px)
- **3XL:** `w-16 h-16` (64px)

---

## ⚡ Performance Considerations

### Why Lucide React?
1. **Tree-shakeable:** Only imports used icons
2. **SVG-based:** Scalable and crisp at any size
3. **No image loading:** Instant render, no HTTP requests
4. **Consistent styling:** Easy to color and size with Tailwind

### Current Asset Load
- **Total Image Files:** 0
- **External Requests:** 0 (except optional texture)
- **Icon Library Size:** ~2-3KB per icon (tree-shaken)

---

## 🎯 Recommendations

### Short Term
1. ✅ Remove any remaining Figma CDN references
2. ✅ Document all icon usages (completed in this file)
3. ✅ Standardize icon sizes across pages

### Medium Term
1. Create custom healthcare illustrations for empty states
2. Add brand logo files (SVG + PNG fallback)
3. Implement icon preload for critical path

### Long Term
1. Consider custom icon set for unique NIRAM features
2. Add animation variants for interactive icons
3. Implement progressive image loading for future media

---

## 📝 Change Log

### v1.0 (Current Refactor)
- Removed all Figma asset dependencies
- Migrated to Lucide React for all icons
- Implemented CSS gradients for branding
- Zero external image dependencies

---

## 🔍 Asset Audit Checklist

- [x] All icons from consistent library (Lucide React)
- [x] No broken external CDN links for icons
- [x] Logo rendered via CSS (no image file)
- [x] Background effects use CSS only
- [x] All icons properly sized and colored
- [x] Mobile responsive icon scaling
- [x] Accessible icon labels (implicit via context)
- [ ] Future: Add alt text/aria-labels for screen readers

---

**Last Updated:** February 14, 2026  
**Maintained By:** NIRAM Development Team  
**Version:** 1.0 - Enterprise Edition
