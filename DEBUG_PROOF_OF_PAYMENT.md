# Debugging Proof of Payment Upload Issues

## If Image Not Showing in Booking Details

Follow these steps to diagnose the issue:

### Step 1: Check Browser Console

1. Open your browser **Developer Tools** (F12 or right-click → Inspect)
2. Go to the **Console** tab
3. Create a new booking and upload a proof of payment
4. Look for console logs showing:
   ```
   Uploading proof of payment for booking: [booking-id]
   Upload successful, URL: https://...
   Booking updated with proof URL: [...]
   ```

### Step 2: Verify Supabase Configuration

#### Check Bucket Exists and Is Public
1. Go to Supabase Dashboard → **Storage**
2. Verify `booking-proofs` bucket exists
3. Click **three dots** next to bucket name
4. Confirm it says **"Make private"** (meaning it's currently PUBLIC)

#### Check RLS Policies
1. Go to **Storage** → `booking-proofs` bucket
2. Click **Policies** tab
3. You should see at least two policies:
   - "Allow anonymous uploads" (INSERT)
   - "Allow public read" (SELECT)

If missing, run this SQL in **SQL Editor**:
```sql
CREATE POLICY "Allow anonymous uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'booking-proofs');

CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'booking-proofs');
```

#### Check Database Column
1. Go to **SQL Editor**
2. Run: `SELECT * FROM bookings LIMIT 1;`
3. Verify `proof_of_payment_url` column exists
4. If not, run:
```sql
ALTER TABLE bookings ADD COLUMN proof_of_payment_url TEXT;
```

### Step 3: Check Booking Record

1. Go to Supabase **Table Editor**
2. Click **bookings** table
3. Find your test booking
4. Verify `proof_of_payment_url` column has a value
5. Copy the URL and paste in browser - should show the image

### Step 4: Test Direct URL

If the URL exists in database but image doesn't show:

1. Find the `proof_of_payment_url` value from booking record
2. Paste it directly in browser address bar
3. If you see a 404 or "Access Denied":
   - Bucket is not public (fix: Make bucket public)
   - RLS policies are wrong (fix: Follow Step 2 above)

### Step 5: Check Admin Panel Display

1. Go to Admin Dashboard → Bookings
2. Click on booking with proof of payment
3. Look at **right column** for image
4. If you see placeholder "No proof of payment uploaded":
   - The `proof_of_payment_url` column value wasn't saved
   - Go back to Step 3 to verify database has the URL

## Common Issues & Solutions

### Issue: Upload fails silently
**Solution**: Check browser console for errors (Step 1)

### Issue: URL saved but image shows 404
**Solution**: Make bucket PUBLIC (Step 2 - Bucket section)

### Issue: URL saved but shows "Access Denied"
**Solution**: Add RLS policies (Step 2 - Policies section)

### Issue: No URL in database
**Solution**: Upload might have failed. Check browser console and verify bucket/policies exist.

### Issue: Column doesn't exist
**Solution**: Run the ALTER TABLE SQL command (Step 2 - Database Column)

## Testing Checklist

- [ ] Bucket `booking-proofs` exists
- [ ] Bucket is PUBLIC (not private)
- [ ] RLS policy for INSERT exists
- [ ] RLS policy for SELECT exists
- [ ] Column `proof_of_payment_url` exists in bookings table
- [ ] Upload completes without console errors
- [ ] URL appears in bookings table row
- [ ] URL is accessible when pasted in browser
- [ ] Image displays in Admin booking details

If all checks pass, the image should display in booking details!
