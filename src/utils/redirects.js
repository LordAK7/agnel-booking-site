/**
 * Utility file for handling redirect URLs
 * This ensures consistent redirect URLs across the application
 */

// Base URL for redirects based on environment
export const redirectBase = import.meta.env.PROD 
  ? 'https://agnel-booking-site.pages.dev' 
  : 'http://localhost:5173';

// Specific redirect URLs
export const getRedirectUrls = () => ({
  signIn: `${redirectBase}/signin`,
  signInVerified: `${redirectBase}/signin?verified=true`,
  resetPassword: `${redirectBase}/reset-password`,
  dashboard: `${redirectBase}/dashboard`,
  forgotPassword: `${redirectBase}/forgot-password`,
}); 