import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    navigate(`/${role.toLowerCase()}-login`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Booking System</h1>
        <p className="text-lg text-gray-600">Please select your role to continue</p>
      </div>

      <div className="space-y-4 w-full max-w-md px-4">
        <button
          onClick={() => handleLogin('staff')}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Staff Login
        </button>

        <button
          onClick={() => handleLogin('admin')}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Admin Login
        </button>

        <button
          onClick={() => handleLogin('super-admin')}
          className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Super Admin Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
