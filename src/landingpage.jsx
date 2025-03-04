import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Booking System</h1>
        <p className="text-lg text-gray-600 mb-8">Coming Soon</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
          >
            Sign In
          </button>
          
          <button
            onClick={handleSignUp}
            className="px-6 py-3 bg-white text-blue-500 font-medium rounded-md border border-blue-500 hover:bg-blue-50 transition duration-300 shadow-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
