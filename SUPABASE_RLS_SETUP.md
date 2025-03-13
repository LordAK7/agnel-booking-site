# Supabase Row Level Security (RLS) Setup

This document provides instructions on how to update the Supabase Row Level Security (RLS) policies to fix the issue where admin users can only see their own bookings instead of all bookings.

## The Issue

Currently, admin users can only see bookings they created themselves, which is not the intended behavior. Admins should be able to see all bookings from all users.

This is likely due to the Row Level Security (RLS) policies in Supabase that restrict users to only seeing their own data.

## Solution: Update RLS Policies

Follow these steps to update the RLS policies in your Supabase project:

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
-- Replace these emails with your admin emails if different
CREATE POLICY "Admins can view all bookings"
ON bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email IN ('adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com')
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
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email IN ('adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com')
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
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email IN ('adityatinkercad@gmail.com', 'ceo@adivirtus.com', 'pranav0423an@gmail.com')
  )
);
```

## Verification

After running these SQL commands, you should:

1. Verify that the policies have been created correctly by going to **Authentication** → **Policies** in the Supabase dashboard
2. Test that admin users can view all bookings by logging in as an admin and checking the admin dashboard
3. Test that regular users can only view their own bookings

## How RLS Works

Row Level Security (RLS) in Supabase allows you to control which rows in a table a user can access. Policies are defined using SQL expressions that are evaluated for each row.

In our case:
- Regular users should only see bookings where `user_id` matches their own `auth.uid()`
- Admin users should see all bookings regardless of who created them

## Troubleshooting

If you're still experiencing issues after updating the RLS policies:

1. Check the browser console for any errors
2. Verify that your admin email is correctly listed in both:
   - The SQL policy (in the `IN` clause)
   - The `ADMIN_EMAILS` array in the `AdminDashboard.jsx` file
3. Make sure the `bookings` table has a `user_id` column that correctly stores the user's ID
4. Try clearing your browser cache and logging in again 