import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsersCog, FaLinkedin, FaGlobe, FaBuilding } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showSocials, setShowSocials] = useState(false);

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Watermark with hover effect */}
      <div 
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out"
        onMouseEnter={() => setShowSocials(true)}
        onMouseLeave={() => setShowSocials(false)}
      >
        <div className="flex flex-col items-end">
          <div className={`bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${showSocials ? 'mb-3' : 'mb-0'}`}>
            <p className="text-indigo-800 font-medium text-sm">Created by Aditya Kamble</p>
          </div>
          
          {/* Social links that appear on hover */}
          <div className={`flex gap-3 transition-all duration-300 ${showSocials ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none'}`}>
            <a 
              href="https://www.linkedin.com/in/aditya-kamble-entrepreneur/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://thegodofcomputers.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
              title="Website"
            >
              <FaGlobe />
            </a>
            <a 
              href="https://adivirtus.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-md"
              title="Company"
            >
              <FaBuilding />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 z-10 border border-white/50">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">Father Agnel Polytechnic, Vashi</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">Seminar Hall 401</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-8 rounded-full"></div>
          
          <p className="text-lg text-gray-700 mb-4">Welcome to the official booking portal for Seminar Hall 401.</p>
          <p className="text-md text-gray-600 mb-6">Sign in to access the booking dashboard and reserve the hall for your events, meetings, and presentations.</p>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center">
            <FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-blue-800 mb-2">Prime Location</h3>
            <p className="text-center text-gray-600">Located at Sector 9A, Vashi, Navi Mumbai, Maharashtra 400703</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md border border-indigo-100 flex flex-col items-center">
            <FaCalendarAlt className="text-indigo-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-indigo-800 mb-2">Modern Facilities</h3>
            <p className="text-center text-gray-600">State-of-the-art AV equipment, seating for 120 people, and climate control</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-100 flex flex-col items-center">
            <FaUsersCog className="text-purple-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-purple-800 mb-2">Easy Booking</h3>
            <p className="text-center text-gray-600">Simple dashboard to check availability and schedule your events</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <button
            onClick={handleSignIn}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl"
          >
            Sign In
          </button>
          
          <button
            onClick={handleSignUp}
            className="px-10 py-4 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-500 hover:bg-indigo-50 transition duration-300 shadow-md transform hover:-translate-y-1 hover:shadow-lg"
          >
            Sign Up
          </button>
        </div>
        
        <div className="text-center text-gray-600 italic bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <p className="font-medium text-indigo-700">After signing in, you'll be redirected to the booking dashboard</p>
          <p>where you can check availability, schedule your events, and manage your bookings.</p>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-indigo-800/70 bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full">
        © {new Date().getFullYear()} Father Agnel Polytechnic, Vashi • Seminar Hall Booking System
      </div>
    </div>
  );
};

export default LandingPage;
