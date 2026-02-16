export const STATUS_COLORS = {
  BOOKED: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    label: 'Booked'
  },
  CONFIRMED: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    label: 'Confirmed'
  },
  SEEN: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    label: 'Seen'
  },
  NO_SHOW: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    label: 'No Show'
  },
  RESCHEDULE_REQUIRED: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    label: 'Reschedule Required'
  },
  FOLLOW_UP: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    label: 'Follow Up'
  },
  CANCELLED: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    label: 'Cancelled'
  },
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    label: 'Pending'
  },
  CONFIRMED_FU: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    label: 'Confirmed'
  },
  DECLINED: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    label: 'Declined'
  }
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS.PENDING;
};
