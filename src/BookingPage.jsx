import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Calendar from 'react-calendar';
import { supabase } from './supabaseClient';
import 'react-calendar/dist/Calendar.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Form state
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('seminar');
  const [otherEventType, setOtherEventType] = useState('');
  const [institute, setInstitute] = useState('Agnel Polytechnic');
  const [department, setDepartment] = useState('ME');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState('2');
  const [timeRange, setTimeRange] = useState('7 am to 9 am');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Add a console log to debug
  useEffect(() => {
    console.log("Auth state:", { user, loading });
  }, [user, loading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Options for departments based on institute
  const getDepartmentOptions = () => {
    if (institute === 'Agnel Polytechnic') {
      return [
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
        { value: 'TE', label: 'Technology Engineering' },
        { value: 'AN', label: 'Animation' },
        { value: 'AE', label: 'Automobile Engineering' },
      ];
    } else {
      return [{ value: 'other', label: 'Other' }];
    }
  };

  // Options for time slots based on duration
  const getTimeRangeOptions = () => {
    switch (timeSlot) {
      case '2':
        return [
          '7 am to 9 am',
          '9 am to 11 am',
          '11 am to 1 pm',
          '1 pm to 3 pm',
          '3 pm to 5 pm',
          '5 pm to 7 pm',
        ];
      case '4':
        return ['9 am to 1 pm', '1 pm to 5 pm'];
      case '8':
        return ['9 am to 5 pm'];
      default:
        return [];
    }
  };

  // Handle time slot change
  useEffect(() => {
    const timeRanges = getTimeRangeOptions();
    if (timeRanges.length > 0) {
      setTimeRange(timeRanges[0]);
    }
  }, [timeSlot]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare booking data
      const bookingData = {
        event_name: eventName,
        event_type: eventType === 'other' ? otherEventType : eventType,
        institute,
        department,
        booking_date: bookingDate.toISOString().split('T')[0],
        time_slot: timeSlot,
        time_range: timeRange,
        special_requests: specialRequests,
        user_id: user.id,
        user_email: user.email,
        status: 'pending',
      };

      // Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select();

      if (error) throw error;

      // Show success message
      setSuccess(true);
      
      // Reset form
      setEventName('');
      setEventType('seminar');
      setOtherEventType('');
      setInstitute('Agnel Polytechnic');
      setDepartment('ME');
      setBookingDate(new Date());
      setTimeSlot('2');
      setTimeRange('7 am to 9 am');
      setSpecialRequests('');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/">
                <img 
                  src="/apv_logo.webp" 
                  alt="APV Logo" 
                  className="h-12 w-auto mr-4 cursor-pointer" 
                />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Agnel Booking</h1>
            </div>
            
            {/* Add navigation menu here */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/booking" 
                className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
              >
                Create Booking
              </Link>
              <Link 
                to="/my-bookings" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                My Bookings
              </Link>
            </div>
            
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.email}</span>
                  <button 
                    onClick={handleSignOut} 
                    className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/signin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 hover:text-indigo-700 border-indigo-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile navigation menu (visible on small screens) */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between py-3">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/booking" 
              className="text-blue-600 text-sm font-medium border-b-2 border-blue-600"
            >
              Create Booking
            </Link>
            <Link 
              to="/my-bookings" 
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p>Booking request submitted successfully! Your request is pending approval.</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Event Type */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type
                </label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="seminar">Seminar</option>
                  <option value="event">Event</option>
                  <option value="workshop">Workshop</option>
                  <option value="other">Other</option>
                </select>
                
                {eventType === 'other' && (
                  <input
                    type="text"
                    value={otherEventType}
                    onChange={(e) => setOtherEventType(e.target.value)}
                    placeholder="Please specify"
                    required
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
              
              {/* Institute */}
              <div>
                <label htmlFor="institute" className="block text-sm font-medium text-gray-700">
                  Institute
                </label>
                <select
                  id="institute"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Agnel Polytechnic">Agnel Polytechnic</option>
                  <option value="FCRIT">FCRIT</option>
                  <option value="FCRIMS">FCRIMS</option>
                  <option value="Agnel Multipurpose School">Agnel Multipurpose School</option>
                  <option value="ITI">ITI</option>
                  <option value="Agnel School of Law">Agnel School of Law</option>
                </select>
              </div>
              
              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {getDepartmentOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Booking Date */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date
                </label>
                <div className="calendar-container">
                  <Calendar
                    onChange={setBookingDate}
                    value={bookingDate}
                    minDate={new Date()}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              </div>
              
              {/* Time Required */}
              <div>
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
                  Time Required
                </label>
                <select
                  id="timeSlot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours (Full Day)</option>
                </select>
              </div>
              
              {/* Time Range */}
              <div>
                <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700">
                  Time Slot
                </label>
                <select
                  id="timeRange"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {getTimeRangeOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Special Requests */}
              <div className="col-span-2">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                  placeholder="Please specify any special requirements (chairs, equipment, setup, etc.)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BookingPage; 