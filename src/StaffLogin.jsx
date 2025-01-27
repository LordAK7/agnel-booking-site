import React, { useState } from 'react';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    institution: '',
    staffId: '',
    password: '',
    eventName: '',
    mobileNumber: '',
    emailId: '',
    bookingDate: '',
    duration: '',
    timeSlot: '',
    supportingStaff: '',
    specialInstructions: ''
  });
  const [staffDetails, setStaffDetails] = useState(null);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    mobileNumber: '',
    emailId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Time slot options based on duration
  const timeSlots = {
    '2': [
      '7:00 AM - 9:00 AM',
      '9:00 AM - 11:00 AM',
      '11:00 AM - 1:00 PM',
      '1:00 PM - 3:00 PM',
      '3:00 PM - 5:00 PM'
    ],
    '4': [
      '9:00 AM - 1:00 PM',
      '1:00 PM - 5:00 PM'
    ],
    '8': [
      '9:00 AM - 5:00 PM (Full Day)'
    ]
  };

  const fetchStaffDetails = async (staffId) => {
    try {
      // In a real app, this would be an API call. For now, we'll import the JSON directly
      const response = await import('./data/agnelschool.json');
      const staffMember = response.default.find(staff => staff.staff_id === staffId);
      if (staffMember) {
        setStaffDetails(staffMember);
        setError('');
      } else {
        setStaffDetails(null);
        setError('Staff ID not found');
      }
    } catch (error) {
      setError('Error fetching staff details');
    }
  };

  const handleStaffIdChange = (e) => {
    const newStaffId = e.target.value;
    setFormData({ ...formData, staffId: newStaffId });
    if (newStaffId.length >= 5) { // Assuming staff IDs are 5 characters long
      fetchStaffDetails(newStaffId);
    } else {
      setStaffDetails(null);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (staffDetails && staffDetails.staff_password === formData.password) {
      setLoginSuccess(true);
      setError('');
    } else {
      setError('Invalid password');
      setLoginSuccess(false);
    }
  };

  const checkBookingConflict = (newBooking) => {
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Filter bookings for the same date and approved status
    const approvedBookings = existingBookings.filter(booking => 
      booking.bookingDate === newBooking.bookingDate && 
      booking.status === 'approved'
    );

    // Check for time slot conflicts
    const hasConflict = approvedBookings.some(booking => {
      // If same time slot, it's a conflict
      if (booking.timeSlot === newBooking.timeSlot) {
        return true;
      }

      // Convert time slots to comparable format
      const [newStart, newEnd] = newBooking.timeSlot.split(' - ');
      const [existingStart, existingEnd] = booking.timeSlot.split(' - ');

      // Convert to 24-hour format for comparison
      const convertTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        return hour * 60 + parseInt(minutes); // Convert to minutes for easier comparison
      };

      const newStartMins = convertTo24Hour(newStart);
      const newEndMins = convertTo24Hour(newEnd);
      const existingStartMins = convertTo24Hour(existingStart);
      const existingEndMins = convertTo24Hour(existingEnd);

      // Check if time slots overlap
      return (newStartMins < existingEndMins && newEndMins > existingStartMins);
    });

    return hasConflict;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create booking object
    const bookingData = {
      id: Date.now(),
      staffName: staffDetails.staff_name,
      staffId: formData.staffId,
      institution: formData.institution,
      eventName: formData.eventName,
      bookingDate: formData.bookingDate,
      timeSlot: formData.timeSlot,
      duration: formData.duration,
      status: 'pending',
      mobileNumber: formData.mobileNumber,
      emailId: formData.emailId,
      supportingStaff: formData.supportingStaff || '',
      specialInstructions: formData.specialInstructions || '',
      department: staffDetails.staff_department
    };

    // Check for booking conflicts
    if (checkBookingConflict(bookingData)) {
      alert('This time slot is already booked for the selected date. Please choose a different time slot or date.');
      return;
    }

    // If no conflict, proceed with booking
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...existingBookings, bookingData]));

    // Reset form
    setFormData({
      institution: '',
      staffId: '',
      password: '',
      eventName: '',
      mobileNumber: '',
      emailId: '',
      bookingDate: '',
      duration: '',
      timeSlot: '',
      supportingStaff: '',
      specialInstructions: ''
    });
    setLoginSuccess(false);
    setStaffDetails(null);

    alert('Booking submitted successfully!');
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
    if (value.length <= 10) {
      setFormData({ ...formData, mobileNumber: value });
      if (value.length === 10) {
        setValidationErrors({ ...validationErrors, mobileNumber: '' });
      } else {
        setValidationErrors({ ...validationErrors, mobileNumber: 'Mobile number must be 10 digits' });
      }
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, emailId: value });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setValidationErrors({ ...validationErrors, emailId: '' });
    } else {
      setValidationErrors({ ...validationErrors, emailId: 'Please enter a valid email address' });
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setFormData({
      ...formData,
      duration: newDuration,
      timeSlot: '' // Reset time slot when duration changes
    });
  };

  const handleCapsLock = (e) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Seminar Hall Booking Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Number Field - Pre-filled and locked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value="401 Seminar Hall"
              disabled
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Institution Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution
            </label>
            <select
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Institution</option>
              <option value="agnel-polytechnic">Agnel Polytechnic</option>
              <option value="agnel-school">Agnel School</option>
              <option value="fcrit">FCRIT</option>
            </select>
          </div>

          {/* Staff Identification Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Staff Identification
            </h3>
            
            {/* Staff ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff ID
              </label>
              <input
                type="text"
                value={formData.staffId}
                onChange={handleStaffIdChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Staff Name - Auto-filled */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Name
              </label>
              <input
                type="text"
                value={staffDetails?.staff_name || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Staff Department - Auto-filled */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={staffDetails?.staff_department || ''}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onKeyDown={handleCapsLock}
                      onKeyUp={handleCapsLock}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Confirm Login
                  </button>
                </div>
                {capsLockOn && (
                  <div className="absolute -bottom-6 left-0">
                    <p className="text-yellow-600 text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Caps Lock is ON
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            {loginSuccess && (
              <p className="text-green-500 text-sm">Login successful!</p>
            )}
          </div>

          {/* Contact Details Section - Only shown after successful login */}
          {loginSuccess && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Details
              </h3>
              
              {/* Event Name - New Required Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event name"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={handleMobileNumberChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter 10-digit mobile number"
                  required
                  maxLength="10"
                />
                {validationErrors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.mobileNumber}</p>
                )}
              </div>

              {/* Email ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.emailId}
                  onChange={handleEmailChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.emailId ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email address"
                  required
                />
                {validationErrors.emailId && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.emailId}</p>
                )}
              </div>
            </div>
          )}

          {/* Booking Details Section - Only shown after contact details */}
          {loginSuccess && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Seminar Hall Booking Details
              </h3>
              
              {/* Booking Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  required
                />
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Duration <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {['2', '4', '8'].map((hours) => (
                    <label key={hours} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="duration"
                        value={hours}
                        checked={formData.duration === hours}
                        onChange={handleDurationChange}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">
                        {hours} Hours {hours === '8' && '(Full Day)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {formData.duration && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots[formData.duration].map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Supporting Staff Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Staff Name <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.supportingStaff}
                  onChange={(e) => setFormData({ ...formData, supportingStaff: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter supporting staff name if applicable"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
                  placeholder="Add any special instructions or notes for the booking"
                />
              </div>
            </div>
          )}

          {/* Submit button - No changes needed to the conditions since these fields are optional */}
          {loginSuccess && (
            <button
              type="submit"
              disabled={
                !formData.institution ||
                !formData.staffId ||
                !formData.mobileNumber ||
                !formData.emailId ||
                !formData.bookingDate ||
                !formData.duration ||
                !formData.timeSlot ||
                !!validationErrors.mobileNumber ||
                !!validationErrors.emailId
              }
              className={`w-full py-2 px-4 rounded-md transition duration-300 ${
                !formData.institution ||
                !formData.staffId ||
                !formData.mobileNumber ||
                !formData.emailId ||
                !formData.bookingDate ||
                !formData.duration ||
                !formData.timeSlot ||
                !!validationErrors.mobileNumber ||
                !!validationErrors.emailId
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Submit Booking
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
