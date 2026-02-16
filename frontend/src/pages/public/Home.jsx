import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Users, Clock, Shield, Heart, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../../images/Niram.png';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast.error('Google authentication failed. Please try again.');
      // Remove error from URL
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl animate-fade-in-down">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-600">NIRAM AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up delay-200">
                  Your Smart Healthcare Management System. Book appointments, manage prescriptions, 
                  and connect with healthcare professionals seamlessly.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow animate-slide-in-left delay-300">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all hover:scale-105 hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 animate-slide-in-right delay-400">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-all hover:scale-105 hover:shadow-xl"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 animate-scale-in delay-200">
          <div className="h-96 w-full sm:h-96 md:h-[500px] lg:w-full lg:h-full flex items-center justify-center p-4 lg:p-8">
            <img 
              src={logo} 
              alt="NIRAM AI Logo" 
              className="w-full h-full max-w-lg object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center animate-fade-in-down">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Better Way to Manage Healthcare
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to streamline your healthcare experience in one place.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-100">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    Easy Appointment Booking
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Book appointments with your preferred doctors in just a few clicks. View available slots in real-time.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-200">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    Expert Doctors
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Connect with qualified healthcare professionals across various specializations.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-300">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    24/7 Access
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Access your medical records, prescriptions, and appointment history anytime, anywhere.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-400">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    Family Management
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Manage appointments and health records for your entire family from one account.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-500">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    Secure & Private
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your health data is encrypted and stored securely. We prioritize your privacy and confidentiality.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="relative p-6 bg-blue-50 rounded-lg hover-lift animate-fade-in-up delay-600">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
                    AI-Powered Insights
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get intelligent health insights and recommendations powered by advanced AI technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 animate-fade-in-up">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Join NIRAM AI today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Experience the future of healthcare management.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-all hover:scale-110 hover:shadow-2xl"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; 2026 NIRAM AI. All rights reserved. | Your Smart Healthcare Partner
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
