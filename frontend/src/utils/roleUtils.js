export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST'
};

export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

export const isPatient = (user) => hasRole(user, ROLES.PATIENT);
export const isDoctor = (user) => hasRole(user, ROLES.DOCTOR);
export const isReceptionist = (user) => hasRole(user, ROLES.RECEPTIONIST);
export const isSuperDoctor = (user) => hasRole(user, ROLES.DOCTOR) && user.isSuperDoctor === true;

export const getRoleBasedPath = (role, isSuperDoctor = false) => {
  switch (role) {
    case ROLES.PATIENT:
      return '/patient/dashboard';
    case ROLES.DOCTOR:
      return isSuperDoctor ? '/super/dashboard' : '/doctor/dashboard';
    case ROLES.RECEPTIONIST:
      return '/reception/dashboard';
    default:
      return '/login';
  }
};
