import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Venue</h1>
        </div>
      </header>
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