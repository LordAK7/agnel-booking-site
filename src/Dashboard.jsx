// src/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

// List of admin emails - keep this in sync with AdminDashboard.jsx
const ADMIN_EMAILS = ['adityatinkercad@gmail.com'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.email}!</h2>
            <p className="mb-6">This is your dashboard. You can manage your bookings here.</p>
            
            {/* Admin Dashboard Link - Only visible to admins */}
            {isAdmin && (
              <div className="mb-6 bg-indigo-100 p-4 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-medium text-indigo-800">Admin Access</h3>
                <p className="mt-1 text-sm text-indigo-600 mb-3">
                  You have administrator privileges. Access the admin dashboard to manage all bookings.
                </p>
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Admin Dashboard
                </Link>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">New Booking</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Create a new booking request for an event or activity.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/booking"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    View and manage your existing booking requests.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/my-bookings"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      View Bookings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;