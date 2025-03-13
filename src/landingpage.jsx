import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsersCog, FaLinkedin, FaGlobe, FaBuilding, FaSignInAlt, FaUserPlus, FaHome, FaCalendar, FaTachometerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showSocials, setShowSocials] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, envError, signOut } = useAuth();

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Environment Error Banner */}
      {envError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white py-2 px-4 z-50 text-center">
          <div className="container mx-auto flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            <span>API configuration error. Please check environment variables.</span>
          </div>
        </div>
      )}
      
      {/* Floating Navigation Bar */}
      <div className={`fixed ${envError ? 'top-8' : 'top-0'} left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img 
              src="/apv_logo.webp" 
              alt="Logo" 
              className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-12'}`}
            />
            <span className={`font-bold transition-all duration-300 ${scrolled ? 'text-indigo-800 text-lg' : 'text-indigo-700 text-xl'}`}>
              Father Agnel Polytechnic
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              icon={<FaHome />} 
              text="Home" 
              active={true} 
              onClick={() => handleNavigation('/')}
            />
            <NavLink 
              icon={<FaCalendar />} 
              text="Booking Page" 
              onClick={() => handleNavigation('/booking')}
            />
            <NavLink 
              icon={<FaTachometerAlt />} 
              text="Dashboard" 
              onClick={() => handleNavigation('/dashboard')}
            />
            
            {!user ? (
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={handleSignIn}
                  className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={handleSignUp}
                  className="flex items-center space-x-1 px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-4">
                <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg flex items-center">
                  <span className="font-medium mr-2">{user.email}</span>
                  <button 
                    onClick={handleSignOut} 
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden bg-indigo-100 p-2 rounded-lg text-indigo-800"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      <div className={`fixed ${envError ? 'top-24' : 'top-16'} left-0 right-0 bg-white shadow-lg rounded-b-lg z-30 p-4 border-t border-gray-100 transition-all duration-300 ${showMobileMenu ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <MobileNavLink 
            icon={<FaHome />} 
            text="Home" 
            active={true} 
            onClick={() => handleNavigation('/')}
          />
          <MobileNavLink 
            icon={<FaCalendar />} 
            text="Booking Page" 
            onClick={() => handleNavigation('/booking')}
          />
          <MobileNavLink 
            icon={<FaTachometerAlt />} 
            text="Dashboard" 
            onClick={() => handleNavigation('/dashboard')}
          />
          
          <div className="pt-3 border-t border-gray-200">
            {!user ? (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleSignIn}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={handleSignUp}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-indigo-800 font-medium">{user.email}</p>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-800 font-medium py-2"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
      
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 z-10 border border-white/50 mt-24">
        {/* Logo added here */}
        <div className="flex justify-center mb-6">
          <img 
            src="/apv_logo.webp" 
            alt="Father Agnel Polytechnic Logo" 
            className="h-24 md:h-32 object-contain filter drop-shadow-md"
          />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">Father Agnel Polytechnic, Vashi</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">Seminar Hall 401</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-8 rounded-full"></div>
          
          <p className="text-lg text-gray-700 mb-4">Welcome to the official booking portal for Seminar Hall 401.</p>
          <p className="text-md text-gray-600 mb-6">Sign in to access the booking dashboard and reserve the hall for your events, meetings, and presentations.</p>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-blue-800 mb-2">Prime Location</h3>
            <p className="text-center text-gray-600">Located at Sector 9A, Vashi, Navi Mumbai, Maharashtra 400703</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl shadow-md border border-indigo-100 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <FaCalendarAlt className="text-indigo-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-indigo-800 mb-2">Modern Facilities</h3>
            <p className="text-center text-gray-600">State-of-the-art AV equipment, seating for 120 people, and climate control</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-100 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <FaUsersCog className="text-purple-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg text-purple-800 mb-2">Easy Booking</h3>
            <p className="text-center text-gray-600">Simple dashboard to check availability and schedule your events</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          {!user ? (
            <>
              <button
                onClick={handleSignIn}
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg transition duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                disabled={envError}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              
              <button
                onClick={handleSignUp}
                className="group relative px-10 py-4 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-500 transition duration-300 shadow-md transform hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                disabled={envError}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <FaUserPlus className="mr-2" />
                  Sign Up
                </span>
                <span className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.email}</span>
              <button 
                onClick={handleSignOut} 
                className="text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        
        {envError && (
          <div className="text-center text-red-600 italic bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
            <p className="font-medium flex items-center justify-center">
              <FaExclamationTriangle className="mr-2" />
              API configuration error
            </p>
            <p>The application is not properly configured. Please contact the administrator.</p>
          </div>
        )}
        
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

// Navigation Link Component
const NavLink = ({ icon, text, active = false, onClick }) => {
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-indigo-100 text-indigo-800 font-medium' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span>{text}</span>
    </a>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ icon, text, active = false, onClick }) => {
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-indigo-100 text-indigo-800 font-medium' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{text}</span>
    </a>
  );
};

export default LandingPage;