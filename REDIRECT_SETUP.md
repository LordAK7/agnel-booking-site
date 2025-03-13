# Setting Up Redirect URLs for Agnel Booking Site

This document provides instructions on how to properly configure your Supabase project to work with the production deployment of the Agnel Booking Site.

## Production URL

The production site is deployed at:
```
https://agnel-booking-site.pages.dev
```

## Supabase Configuration

### 1. Update Site URL

1. Go to your [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Navigate to Authentication → URL Configuration
4. Set the Site URL to:
   ```
   https://agnel-booking-site.pages.dev
   ```

### 2. Add Redirect URLs

In the same URL Configuration page, add the following Redirect URLs:

```
https://agnel-booking-site.pages.dev/signin
https://agnel-booking-site.pages.dev/signin?verified=true
https://agnel-booking-site.pages.dev/reset-password
https://agnel-booking-site.pages.dev/dashboard
https://agnel-booking-site.pages.dev/forgot-password
```

### 3. Save Changes

Click "Save" to apply these changes to your Supabase project.

## Testing Email Flows

After updating the configuration, test the following email flows:

1. **User Registration**: Sign up with a new email address and verify that the confirmation email contains the correct redirect URL.
2. **Password Reset**: Request a password reset and verify that the email contains the correct reset URL.

## Troubleshooting

If you encounter issues with redirects:

1. **Check Browser Console**: Look for any CORS or redirect-related errors.
2. **Verify Environment Variables**: Ensure your production environment has the correct Supabase URL and API key.
3. **Check Supabase Logs**: Review the authentication logs in your Supabase dashboard for any errors.

## Local Development

For local development, the application automatically uses `http://localhost:5173` as the base URL for redirects. No additional configuration is needed for local testing.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/) 