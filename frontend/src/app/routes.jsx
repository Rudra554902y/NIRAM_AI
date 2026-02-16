import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';
import DoctorLayout from '../layouts/DoctorLayout';
import ReceptionLayout from '../layouts/ReceptionLayout';
import SuperDoctorLayout from '../layouts/SuperDoctorLayout';

// Skeleton loaders
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import FormSkeleton from '../components/skeletons/FormSkeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';

// Lazy load pages - Public
const Home = lazy(() => import('../pages/public/Home'));
const Login = lazy(() => import('../pages/public/Login'));
const Register = lazy(() => import('../pages/public/Register'));
const GoogleCallback = lazy(() => import('../pages/auth/google/Callback'));

// Lazy load pages - Patient
const PatientDashboard = lazy(() => import('../pages/patient/Dashboard'));
const BookAppointment = lazy(() => import('../pages/patient/BookAppointment'));
const MyAppointments = lazy(() => import('../pages/patient/MyAppointments'));
const FollowUps = lazy(() => import('../pages/patient/FollowUps'));
const PatientProfile = lazy(() => import('../pages/patient/Profile'));

// Lazy load pages - Doctor
const DoctorDashboard = lazy(() => import('../pages/doctor/Dashboard'));
const DoctorAppointments = lazy(() => import('../pages/doctor/Appointments'));
const Consultation = lazy(() => import('../pages/doctor/Consultation'));
const EmergencyLeave = lazy(() => import('../pages/doctor/EmergencyLeave'));
const DoctorProfile = lazy(() => import('../pages/doctor/Profile'));

// Lazy load pages - Reception
const ReceptionDashboard = lazy(() => import('../pages/reception/Dashboard'));
const ReceptionAppointments = lazy(() => import('../pages/reception/Appointments'));
const BookAppointmentReception = lazy(() => import('../pages/reception/BookAppointment'));
const Prescriptions = lazy(() => import('../pages/reception/Prescriptions'));
const ReceptionProfile = lazy(() => import('../pages/reception/Profile'));

// Lazy load pages - Super Doctor
const SuperDashboard = lazy(() => import('../pages/super/Dashboard'));
const StaffManagement = lazy(() => import('../pages/super/StaffManagement'));
const SuperProfile = lazy(() => import('../pages/super/Profile'));

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case 'PATIENT':
      return <Navigate to="/patient/dashboard" replace />;
    case 'DOCTOR':
      return user.isSuperDoctor 
        ? <Navigate to="/super/dashboard" replace />
        : <Navigate to="/doctor/dashboard" replace />;
    case 'RECEPTIONIST':
      return <Navigate to="/reception/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <Register />
            </Suspense>
          }
        />
      </Route>

      {/* Google OAuth Callback - Not in PublicLayout to avoid navbar */}
      <Route
        path="/auth/google/callback"
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <GoogleCallback />
          </Suspense>
        }
      />

      {/* Dashboard redirect for logged in users */}
      <Route path="/dashboard" element={<RoleBasedRedirect />} />

      {/* Patient Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/patient/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <PatientDashboard />
            </Suspense>
          }
        />
        <Route
          path="/patient/book-appointment"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <BookAppointment />
            </Suspense>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <MyAppointments />
            </Suspense>
          }
        />
        <Route
          path="/patient/follow-ups"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <FollowUps />
            </Suspense>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <PatientProfile />
            </Suspense>
          }
        />
      </Route>

      {/* Doctor Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/doctor/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DoctorDashboard />
            </Suspense>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <DoctorAppointments />
            </Suspense>
          }
        />
        <Route
          path="/doctor/consultation/:id"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <Consultation />
            </Suspense>
          }
        />
        <Route
          path="/doctor/emergency-leave"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <EmergencyLeave />
            </Suspense>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <DoctorProfile />
            </Suspense>
          }
        />
      </Route>

      {/* Reception Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
            <ReceptionLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/reception/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReceptionDashboard />
            </Suspense>
          }
        />
        <Route
          path="/reception/appointments"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <ReceptionAppointments />
            </Suspense>
          }
        />
        <Route
          path="/reception/book-appointment"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <BookAppointmentReception />
            </Suspense>
          }
        />
        <Route
          path="/reception/prescriptions"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <Prescriptions />
            </Suspense>
          }
        />
        <Route
          path="/reception/profile"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <ReceptionProfile />
            </Suspense>
          }
        />
      </Route>

      {/* Super Doctor Routes (also DOCTOR role) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <SuperDoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/super/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <SuperDashboard />
            </Suspense>
          }
        />
        <Route
          path="/super/staff"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <StaffManagement />
            </Suspense>
          }
        />
        <Route
          path="/super/profile"
          element={
            <Suspense fallback={<FormSkeleton />}>
              <SuperProfile />
            </Suspense>
          }
        />
      </Route>

      {/* 404 - Redirect to role-based home */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
