import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  Calendar, 
  Stethoscope, 
  User, 
  LogOut, 
  Menu, 
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: Home },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { name: 'Consultations', href: '/doctor/consultations', icon: Stethoscope },
    { name: 'Emergency Leave', href: '/doctor/emergency-leave', icon: AlertCircle },
    { name: 'Profile', href: '/doctor/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 bg-green-600">
            <h1 className="text-xl font-bold text-white">NIRAM AI</h1>
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Dr. {user?.name}</p>
                <p className="text-sm text-gray-500">Doctor</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="lg:hidden text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:hidden"></div>
            <div className="text-sm text-gray-500">
              Welcome, <span className="font-medium text-gray-900">Dr. {user?.name}</span>
            </div>
          </div>
        </div>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
