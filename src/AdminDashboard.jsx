import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { supabase, supabaseAdmin } from './supabaseClient';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

// List of admin emails - in a real app, this would be stored in the database
const ADMIN_EMAILS = ['adityatinkercad@gmail.com','ceo@adivirtus.com','pranav0423an@gmail.com'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate, isAdmin]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // Determine which Supabase client to use
        // If supabaseAdmin is available, use it to bypass RLS
        // Otherwise, fall back to regular supabase client
        const client = supabaseAdmin || supabase;
        
        // Create the query to fetch all bookings
        let query = client.from('bookings').select('*');
        
        // Apply status filter if not "all"
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        // Order by creation date, descending
        const { data, error } = await query.order('created_at', { ascending: false });
        
        console.log("Fetched bookings:", data);
        console.log("Fetch error:", error);
        
        if (error) {
          // If there's an error, it might be due to RLS policies or missing service key
          console.error("Error fetching bookings:", error);
          throw error;
        }
        
        // If no data or empty array, check if it might be due to RLS
        if (!data || data.length === 0) {
          console.warn("No bookings found or RLS might be restricting access. Check Supabase RLS policies.");
        }
        
        setBookings(data || []);
      } catch (error) {
        console.error("Error in fetchBookings:", error);
        if (error.message.includes("permission denied")) {
          setError(`Permission denied. This is likely because:
          1. The VITE_SUPABASE_SERVICE_KEY environment variable is not set, or
          2. The RLS policies need to be updated.
          Please check the SUPABASE_RLS_SETUP.md file for instructions.`);
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchBookings();
    }
  }, [isAdmin, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Use admin client if available
      const client = supabaseAdmin || supabase;
      
      const { error } = await client
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        // Use admin client if available
        const client = supabaseAdmin || supabase;
        
        const { error } = await client
          .from('bookings')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Update local state
        setBookings(bookings.filter(booking => booking.id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/apv_logo.webp" 
              alt="Logo" 
              className="h-10"
            />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNavigateToDashboard}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Booking Requests</h2>
              <div>
                <label htmlFor="statusFilter" className="mr-2">Filter by status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="text-center py-4">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-4">
                <p className="mb-2">No bookings found.</p>
                <p className="text-sm text-red-600">
                  If you're an admin and expecting to see all bookings, you may need to update the Supabase Row Level Security (RLS) policies.
                  Please refer to the SUPABASE_RLS_SETUP.md file for instructions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Info
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.event_name}</div>
                          <div className="text-sm text-gray-500">{booking.event_type}</div>
                          <div className="text-sm text-gray-500">{booking.institute} - {booking.department}</div>
                          {booking.special_requests && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">Special Requests:</span>
                              <p className="text-sm text-gray-500 mt-1">{booking.special_requests}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(booking.booking_date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{booking.time_range}</div>
                          <div className="text-sm text-gray-500">{booking.time_slot} hours</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.user_email}</div>
                          <div className="text-sm text-gray-500">Created: {new Date(booking.created_at).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'approved')}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 mr-2"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 