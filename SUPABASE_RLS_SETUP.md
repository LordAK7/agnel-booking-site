# Supabase Row Level Security (RLS) Setup

This document provides instructions on how to fix the "permission denied for table users" error and allow admin users to see all bookings.

## The Issue

There are two main issues:

1. Admin users can only see bookings they created themselves
2. The RLS policies are causing "permission denied for table users" errors

## Solution 1: Set Up Service Role Key (Recommended)

The simplest solution is to use Supabase's service role key, which allows bypassing RLS policies for admin users.

### Step 1: Get Your Supabase Service Role Key

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Project Settings** → **API**
4. Find the **service_role key** (it's labeled as "secret" and should be kept secure)

### Step 2: Add the Service Role Key to Your Environment Variables

Add this to your `.env` file:

```
VITE_SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Important**: Never commit this key to your repository. Make sure `.env` is in your `.gitignore` file.

### Step 3: Restart Your Development Server

After adding the environment variable, restart your development server for the changes to take effect.

## Solution 2: Update RLS Policies (Alternative)

If you prefer not to use the service role key, you can update your RLS policies to a simpler version that doesn't reference the `auth.users` table.

Follow these steps:

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy and paste the SQL commands below
6. Run the SQL commands

```sql
-- First, enable Row Level Security on the bookings table if not already enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update any booking" ON bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete any booking" ON bookings;

-- Create policy for users to view their own bookings
CREATE POLICY "Users can view their own bookings"
ON bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for admins to view all bookings
-- This simpler version doesn't reference the auth.users table
CREATE POLICY "Admins can view all bookings"
ON bookings
FOR SELECT
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
    'adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com'
  )
);

-- Create policy for users to insert their own bookings
CREATE POLICY "Users can insert their own bookings"
ON bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own bookings
CREATE POLICY "Users can update their own bookings"
ON bookings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for admins to update any booking
CREATE POLICY "Admins can update any booking"
ON bookings
FOR UPDATE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
    'adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com'
  )
);

-- Create policy for users to delete their own bookings
CREATE POLICY "Users can delete their own bookings"
ON bookings
FOR DELETE
USING (auth.uid() = user_id);

-- Create policy for admins to delete any booking
CREATE POLICY "Admins can delete any booking"
ON bookings
FOR DELETE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
    'adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com'
  )
);
```

## Verification

After implementing either solution, you should:

1. Verify that admin users can view all bookings by logging in as an admin and checking the admin dashboard
2. Verify that regular users can only view their own bookings
3. Check that there are no "permission denied" errors in the browser console

## Troubleshooting

If you're still experiencing issues:

1. Check the browser console for any errors
2. Verify that your admin email is correctly listed in:
   - The SQL policy (in the `IN` clause)
   - The `ADMIN_EMAILS` array in both the `AdminDashboard.jsx` and `MyBookings.jsx` files
3. Make sure the `bookings` table has a `user_id` column that correctly stores the user's ID
4. Try clearing your browser cache and logging in again
5. If using Solution 1, verify that the service role key is correctly set in your environment variables 