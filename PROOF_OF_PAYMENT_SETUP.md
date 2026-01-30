# Proof of Payment Setup Guide

## Steps to Enable Proof of Payment Upload in Supabase

### 1. Create Storage Bucket for Booking Proofs

1. Go to your **Supabase Project Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name the bucket: `booking-proofs`
5. Click **Create bucket**

### 2. Set Bucket to Public (for viewing)

1. In the **Storage** section, find the `booking-proofs` bucket
2. Click on the **three dots menu** next to the bucket name
3. Select **Make public**
4. Confirm the action

### 2b. Configure RLS Policies for Anonymous Uploads (CRITICAL)

To allow customers (who are not logged in) to upload proof of payment, you must enable public uploads:

**Option A: Using Supabase Dashboard**
1. Go to **Storage** → `booking-proofs` bucket
2. Click the **Policies** tab
3. Click **Create policy** 
4. Select **For INSERT**
5. Name it: "Allow anonymous uploads"
6. Leave all conditions empty (allows all)
7. Click **Save**
8. Repeat step 3-7 for **SELECT** policy named "Allow anonymous read"

**Option B: Using SQL Editor**
Run this SQL in your Supabase **SQL Editor**:

```sql
-- Allow anonymous uploads
CREATE POLICY "Allow anonymous uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'booking-proofs');

-- Allow public read
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'booking-proofs');
```

### 3. Add Column to Bookings Table (if not exists)

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE bookings ADD COLUMN proof_of_payment_url TEXT;
```

### 4. Update RLS Policy (Optional but Recommended)

Basic public read access is now configured via the storage policies above.

### 5. Test the Feature

1. Create a new booking on the homepage
2. On Step 2 (Payment), upload a proof of payment image
3. Go to the Admin Dashboard → Bookings
4. Click on a booking to view details
5. The proof of payment should display in the right column

## File Upload Details

- **Bucket**: `booking-proofs`
- **File Structure**: `booking-proofs/{bookingId}-{timestamp}.{extension}`
- **Accepted Formats**: Any image format (jpg, png, gif, webp, etc.)
- **Max File Size**: Depends on your Supabase plan (typically 5GB per file)

## Troubleshooting

### Upload Fails
- Ensure the `booking-proofs` bucket is created and public
- Check browser console for error messages
- Verify file is a valid image

### Image Won't Display in Admin
- Check that the bucket is set to **Public**
- Verify the `proof_of_payment_url` column exists in the bookings table
- Check browser console for 404 errors

### Database Error
- Run the SQL command to add the column if you get "column does not exist" errors
- Ensure you're connected to the correct Supabase project
