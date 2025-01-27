import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },
  booking: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

// PDF Document Component
const MonthlyReport = ({ bookings, month, year }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Seminar Hall Booking Report</Text>
      <Text style={styles.subtitle}>
        {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
      </Text>

      {/* Approved Bookings */}
      <Text style={styles.header}>Approved Bookings</Text>
      {bookings
        .filter(booking => booking.status === 'approved')
        .map(booking => (
          <View key={booking.id} style={styles.booking}>
            <Text style={styles.text}>Event: {booking.eventName}</Text>
            <Text style={styles.text}>Staff Name: {booking.staffName}</Text>
            <Text style={styles.text}>Department: {booking.department}</Text>
            <Text style={styles.text}>Date: {booking.bookingDate}</Text>
            <Text style={styles.text}>Time Slot: {booking.timeSlot}</Text>
            <Text style={styles.text}>Duration: {booking.duration} hours</Text>
          </View>
        ))}

      {/* Rejected Bookings */}
      <Text style={styles.header}>Rejected Bookings</Text>
      {bookings
        .filter(booking => booking.status === 'rejected')
        .map(booking => (
          <View key={booking.id} style={styles.booking}>
            <Text style={styles.text}>Staff Name: {booking.staffName}</Text>
            <Text style={styles.text}>Department: {booking.department}</Text>
            <Text style={styles.text}>Date: {booking.bookingDate}</Text>
            <Text style={styles.text}>Time Slot: {booking.timeSlot}</Text>
            <Text style={styles.text}>Reason: {booking.rejectionReason}</Text>
          </View>
        ))}

      {/* Pending Bookings */}
      <Text style={styles.header}>Pending Bookings</Text>
      {bookings
        .filter(booking => booking.status === 'pending')
        .map(booking => (
          <View key={booking.id} style={styles.booking}>
            <Text style={styles.text}>Staff Name: {booking.staffName}</Text>
            <Text style={styles.text}>Department: {booking.department}</Text>
            <Text style={styles.text}>Date: {booking.bookingDate}</Text>
            <Text style={styles.text}>Time Slot: {booking.timeSlot}</Text>
          </View>
        ))}
    </Page>
  </Document>
);

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on component mount
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Fetch bookings from localStorage on component mount
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedBooking(null);
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => 
      new Date(booking.bookingDate).toDateString() === date.toDateString()
    );
  };

  // Function to filter bookings by month and year
  const getBookingsForMonth = (month, year) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
    });
  };

  // Add this function to check for conflicts when approving
  const checkForConflicts = (bookingToApprove) => {
    const otherApprovedBookings = bookings.filter(booking => 
      booking.id !== bookingToApprove.id && 
      booking.bookingDate === bookingToApprove.bookingDate && 
      booking.status === 'approved'
    );

    // Use the same time slot comparison logic as in StaffLogin
    const hasConflict = otherApprovedBookings.some(booking => {
      const [newStart, newEnd] = bookingToApprove.timeSlot.split(' - ');
      const [existingStart, existingEnd] = booking.timeSlot.split(' - ');

      const convertTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        return hour * 60 + parseInt(minutes);
      };

      const newStartMins = convertTo24Hour(newStart);
      const newEndMins = convertTo24Hour(newEnd);
      const existingStartMins = convertTo24Hour(existingStart);
      const existingEndMins = convertTo24Hour(existingEnd);

      return (newStartMins < existingEndMins && newEndMins > existingStartMins);
    });

    return hasConflict;
  };

  const handleBookingAction = (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (action === 'approve') {
      // Check for conflicts before approving
      if (checkForConflicts(selectedBooking)) {
        alert('Cannot approve this booking as it conflicts with another approved booking for the same time slot.');
        return;
      }
    }

    const updatedBookings = bookings.map(booking => {
      if (booking.id === selectedBooking.id) {
        return {
          ...booking,
          status: action === 'approve' ? 'approved' : 'rejected',
          rejectionReason: action === 'reject' ? rejectionReason : null
        };
      }
      return booking;
    });

    // Update localStorage
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    setShowModal(false);
    setRejectionReason('');
    setSelectedBooking(null);
  };

  // Add delete booking function
  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete function
  const confirmDelete = () => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingToDelete.id);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    setShowDeleteConfirmation(false);
    setBookingToDelete(null);
    setShowModal(false);
  };

  // Update the booking card display to show conflicts
  const BookingCard = ({ booking }) => {
    const hasConflict = checkForConflicts(booking);
    
    return (
      <div 
        className={`bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-xl cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
          hasConflict ? 'border-red-300' : ''
        }`}
        onClick={() => {
          setSelectedBooking(booking);
          setShowModal(true);
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{booking.eventName}</h3>
            <p className="text-sm text-gray-600">By: {booking.staffName}</p>
            <p className="text-sm text-gray-600 mt-1">{booking.timeSlot}</p>
            <p className="text-sm text-gray-600">Duration: {booking.duration} hours</p>
            <p className="text-sm text-gray-600 mt-1">Department: {booking.department}</p>
            {hasConflict && booking.status === 'pending' && (
              <p className="text-xs text-red-500 mt-1">
                Conflicts with another approved booking
              </p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'approved' ? 'bg-green-100 text-green-800' :
              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBooking(booking);
                }}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Monthly Report</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          
          <PDFDownloadLink
            document={
              <MonthlyReport 
                bookings={getBookingsForMonth(selectedMonth, selectedYear)}
                month={selectedMonth}
                year={selectedYear}
              />
            }
            fileName={`booking-report-${selectedMonth + 1}-${selectedYear}.pdf`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            {({ loading }) => (loading ? 'Generating...' : 'Download Report')}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
            >
              Monthly Report
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="calendar-container">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={({ date }) => {
                  const dayBookings = getBookingsForDate(date);
                  return dayBookings.length > 0 && (
                    <div className="relative">
                      <span className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 flex h-5 w-5 items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                        {dayBookings.length}
                      </span>
                    </div>
                  );
                }}
                className="custom-calendar"
              />
            </div>
          </div>

          {/* Bookings List Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200">
              Bookings for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            <div className="space-y-4">
              {getBookingsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings for this date
                </div>
              ) : (
                getBookingsForDate(selectedDate).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && <ReportModal />}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this booking request? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setBookingToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p><span className="font-semibold">Staff Name:</span> {selectedBooking.staffName}</p>
                  <p><span className="font-semibold">Staff ID:</span> {selectedBooking.staffId}</p>
                  <p><span className="font-semibold">Institution:</span> {selectedBooking.institution}</p>
                  <p><span className="font-semibold">Mobile:</span> {selectedBooking.mobileNumber}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Date:</span> {selectedBooking.bookingDate}</p>
                  <p><span className="font-semibold">Time Slot:</span> {selectedBooking.timeSlot}</p>
                  <p><span className="font-semibold">Duration:</span> {selectedBooking.duration} hours</p>
                  <p><span className="font-semibold">Email:</span> {selectedBooking.emailId}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleBookingAction('approve')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleBookingAction('reject')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteBooking(selectedBooking)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete Booking
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>

              {selectedBooking.status === 'pending' && (
                <div className="mt-4">
                  <textarea
                    placeholder="Reason for rejection (required for rejection)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 