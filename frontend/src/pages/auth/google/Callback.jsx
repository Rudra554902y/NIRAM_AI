import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getRoleBasedPath } from '../../../utils/roleUtils';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get token and user data from URL params
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          toast.error('Google authentication failed');
          navigate('/');
          return;
        }

        if (!token || !userDataStr) {
          toast.error('Authentication data missing');
          navigate('/');
          return;
        }

        // Decode and parse user data
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        
        // Store token and user data in localStorage
        localStorage.setItem('accessToken', decodeURIComponent(token));
        localStorage.setItem('user', JSON.stringify(userData));

        // Update auth context
        updateUser(userData);

        // Show success message
        toast.success('Successfully logged in with Google!');

        // Redirect to appropriate dashboard
        const redirectPath = getRoleBasedPath(userData.role, userData.isSuperDoctor);
        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google authentication');
        navigate('/');
      }
    };

    handleCallback();
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google Sign-In...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
