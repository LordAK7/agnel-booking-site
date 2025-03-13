/**
 * This script updates the Supabase project configuration
 * Run this script after deploying your application to update the redirect URLs
 * 
 * Usage: node scripts/update-supabase-config.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This is different from the anon key

// Production URL
const productionUrl = 'https://agnel-booking-site.pages.dev';

async function updateRedirectURLs() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please check your environment variables.');
    process.exit(1);
  }

  try {
    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Define redirect URLs
    const redirectUrls = [
      `${productionUrl}/signin`,
      `${productionUrl}/signin?verified=true`,
      `${productionUrl}/reset-password`,
      `${productionUrl}/dashboard`,
      `${productionUrl}/forgot-password`,
    ];
    
    console.log('Updating Supabase redirect URLs...');
    console.log('Site URL:', productionUrl);
    console.log('Redirect URLs:', redirectUrls);
    
    // Note: This is a placeholder. The actual API call depends on Supabase's admin API
    // You may need to use the Supabase Management API or update this manually in the dashboard
    console.log('Please update these URLs manually in the Supabase dashboard:');
    console.log('1. Go to https://app.supabase.io/project/_/auth/url-configuration');
    console.log('2. Set Site URL to:', productionUrl);
    console.log('3. Add the following Redirect URLs:');
    redirectUrls.forEach(url => console.log(`   - ${url}`));
    
    console.log('\nAlternatively, you can use the Supabase Management API if you have access.');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating Supabase configuration:', error);
    return { success: false, error };
  }
}

// Run the function
updateRedirectURLs()
  .then(result => {
    if (result.success) {
      console.log('Configuration update instructions provided.');
    } else {
      console.error('Failed to update configuration:', result.error);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  }); 