# Supabase Setup Guide for Pickleball Court Booking System

This guide walks you through setting up Supabase for:
- ✅ Dynamic court management (admin adds/edits/deletes courts)
- ✅ Court images storage
- ✅ Admin authentication
- ✅ Booking management with real-time availability
- ✅ Real-time updates for customers to see court availability

---

## Phase 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or Sign In
3. Create a new project:
   - **Name**: `Pickleball-Booking`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project initialization (2-3 minutes)
5. Go to **Settings > API** and copy:
   - `Project URL` → save as `VITE_SUPABASE_URL`
   - `anon public` key → save as `VITE_SUPABASE_ANON_KEY`

---

## Phase 2: Create Database Tables

Go to **SQL Editor** in Supabase and run these scripts one by one:

### 2.1 Create `courts` table

```sql
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read courts
CREATE POLICY "Courts are readable by everyone" ON courts
  FOR SELECT USING (true);

-- Policy: Only admin who created can edit/delete
CREATE POLICY "Courts can be updated/deleted by admin" ON courts
  FOR UPDATE USING (auth.uid() = admin_id);

CREATE POLICY "Courts can be deleted by admin" ON courts
  FOR DELETE USING (auth.uid() = admin_id);

-- Policy: Only authenticated admins can insert
CREATE POLICY "Authenticated admins can create courts" ON courts
  FOR INSERT WITH CHECK (auth.uid() = admin_id);
```

### 2.2 Create `bookings` table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price NUMERIC,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read bookings
CREATE POLICY "Bookings are readable by everyone" ON bookings
  FOR SELECT USING (true);

-- Policy: Authenticated users can create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Policy: Only admin or owner can update/delete
CREATE POLICY "Admin can update bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT admin_id FROM courts WHERE id = court_id
    )
  );

CREATE POLICY "Admin can delete bookings" ON bookings
  FOR DELETE USING (
    auth.uid() IN (
      SELECT admin_id FROM courts WHERE id = court_id
    )
  );
```

### 2.3 Create `admin_users` table (optional, for additional admin info)

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can read their own info
CREATE POLICY "Admins can read their own info" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Admins can update their own info
CREATE POLICY "Admins can update their own info" ON admin_users
  FOR UPDATE USING (auth.uid() = id);
```

---

## Phase 3: Set Up Storage for Court Images

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**:
   - **Name**: `court-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
   - Click **Create bucket**

3. **Set bucket policies**:
   - Click on `court-images` bucket
   - Go to **Policies** tab
   - Click **New policy** → **For public anonymous access**
   - Select: `SELECT` and `INSERT` 
   - Click **Review** → **Save policy**

---

## Phase 4: Enable Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Providers**
3. Make sure **Email** is enabled (should be by default)
4. Go to **URL Configuration**:
   - Set **Site URL**: `http://localhost:5173` (for local development)
   - Set **Redirect URLs**: 
     - `http://localhost:5173/admin/dashboard`
     - `http://localhost:5173/admin/login`
     - (Update to your production domain later)

---

## Phase 5: Create Your First Admin Account

### Option A: Via Supabase Dashboard (Recommended for setup)

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - **Email**: `admin@pickleball.com` (or your admin email)
   - **Password**: Create a strong password
4. Click **Save**

### Option B: Via sign-up (when you implement auth UI)
- User will sign up in the app and you'll mark them as admin

---

## Phase 6: Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from **Settings > API**

---

## Phase 7: Update Your App Structure

### 7.1 Install Supabase package

```bash
npm install @supabase/supabase-js
```

### 7.2 Create Supabase client: `src/lib/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 7.3 Create Courts Service: `src/services/courts.js`

```javascript
import { supabase } from '../lib/supabaseClient';

// Upload images to storage
export async function uploadCourtImages(files) {
  const results = [];
  
  for (const file of files) {
    const unique = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('court-images')
      .upload(unique, file);
    
    if (error) {
      console.error('Upload error:', error);
      continue;
    }
    
    const { data: urlData } = supabase.storage
      .from('court-images')
      .getPublicUrl(unique);
    
    results.push({ 
      path: unique, 
      url: urlData.publicUrl 
    });
  }
  
  return results;
}

// List all courts
export async function listCourts() {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('listCourts error:', error);
    return [];
  }
  
  return data;
}

// Get single court with bookings
export async function getCourt(courtId) {
  const { data, error } = await supabase
    .from('courts')
    .select('*, bookings(*)')
    .eq('id', courtId)
    .single();
  
  if (error) {
    console.error('getCourt error:', error);
    return null;
  }
  
  return data;
}

// Create court (admin only)
export async function createCourt({ name, type, price, description, imageFiles }) {
  const images = await uploadCourtImages(Array.from(imageFiles || []));
  
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('courts')
    .insert([{
      name,
      type,
      price,
      description,
      admin_id: user.user.id,
      images // store array of { path, url }
    }])
    .select();
  
  if (error) {
    console.error('createCourt error:', error);
    throw error;
  }
  
  return data?.[0];
}

// Delete court (admin only)
export async function deleteCourt(courtId) {
  const { data: court } = await supabase
    .from('courts')
    .select('images')
    .eq('id', courtId)
    .single();
  
  // Delete images from storage
  if (court?.images?.length) {
    const paths = court.images.map(img => img.path);
    await supabase.storage.from('court-images').remove(paths);
  }
  
  const { error } = await supabase
    .from('courts')
    .delete()
    .eq('id', courtId);
  
  if (error) throw error;
}

// Subscribe to court changes (real-time)
export function subscribeToCourts(callback) {
  return supabase
    .channel('courts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, callback)
    .subscribe();
}
```

### 7.4 Create Bookings Service: `src/services/bookings.js`

```javascript
import { supabase } from '../lib/supabaseClient';

// Get bookings for a court on a specific date
export async function getCourtBookings(courtId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .eq('booking_date', date);
  
  if (error) {
    console.error('getCourtBookings error:', error);
    return [];
  }
  
  return data;
}

// Create booking
export async function createBooking({
  courtId,
  customerName,
  customerEmail,
  customerPhone,
  bookingDate,
  startTime,
  endTime,
  totalPrice,
  notes
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      court_id: courtId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice,
      status: 'Pending',
      notes
    }])
    .select();
  
  if (error) {
    console.error('createBooking error:', error);
    throw error;
  }
  
  return data?.[0];
}

// Get all bookings (admin)
export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, courts(name, type)')
    .order('booking_date', { ascending: false });
  
  if (error) {
    console.error('getAllBookings error:', error);
    return [];
  }
  
  return data;
}

// Update booking status (admin)
export async function updateBookingStatus(bookingId, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select();
  
  if (error) throw error;
  
  return data?.[0];
}

// Subscribe to bookings (real-time)
export function subscribeToBookings(callback) {
  return supabase
    .channel('bookings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, callback)
    .subscribe();
}
```

### 7.5 Create Auth Service: `src/services/auth.js`

```javascript
import { supabase } from '../lib/supabaseClient';

// Sign up (for admin)
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  
  // Optionally add to admin_users table
  if (data.user) {
    await supabase.from('admin_users').insert([{
      id: data.user.id,
      email: data.user.email
    }]);
  }
  
  return data;
}

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
}

// Get current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  
  return data.user;
}

// Listen to auth state changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

// Check if user is admin (optional - can expand)
export async function isAdmin() {
  const user = await getCurrentUser();
  
  if (!user) return false;
  
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return !!data;
}
```

---

## Phase 8: Update Components to Use Real-Time Availability

### 8.1 Update `Home.jsx` to show real-time availability

Update the booking section to:
1. Fetch courts from Supabase instead of localStorage
2. Get bookings for selected court and date
3. Show available/unavailable time slots based on bookings
4. Subscribe to real-time booking changes

### 8.2 Update `AdminCourts.jsx` to manage courts via Supabase

Update to:
1. Load courts from `listCourts()`
2. Support image uploads via `uploadCourtImages()`
3. Create courts via `createCourt()`
4. Delete courts via `deleteCourt()`
5. Subscribe to real-time court changes

### 8.3 Create Admin Authentication Pages

Create `src/pages/AdminLogin.jsx`:
- Email/password login form
- Uses `signIn()` from auth service
- Redirects to admin dashboard on success

Create Protected Admin Layout:
- Wraps admin pages
- Checks if user is authenticated
- Redirects to login if not

---

## Phase 9: Test the Setup

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

### Manual Testing Checklist

- [ ] Can sign in as admin
- [ ] Admin can add court with name, type, price, description
- [ ] Admin can upload multiple images for court
- [ ] Images appear in admin dashboard
- [ ] Customers see courts on homepage
- [ ] Customers can select a court and date
- [ ] Available/unavailable time slots show correctly
- [ ] Booking creates entry in Supabase
- [ ] Admin sees bookings in dashboard with status
- [ ] Real-time updates work (open 2 browser tabs, book in one, see update in other)

---

## Phase 10: Deployment

When deploying to production:

1. Update Supabase **URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs:
     - `https://yourdomain.com/admin/dashboard`
     - `https://yourdomain.com/admin/login`

2. In `vite.config.js`, ensure env vars are properly loaded

3. Deploy to Vercel/Netlify and set environment variables there

---

## Useful Supabase Links

- **Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: To run SQL scripts
- **Table Editor**: Visual table management
- **Storage**: Manage files
- **Authentication**: Manage users
- **Realtime**: Configure realtime subscriptions

---

## Summary of Supabase Resources You'll Create

| Resource | Purpose |
|----------|---------|
| `courts` table | Store court info with images |
| `bookings` table | Store all booking requests |
| `admin_users` table | Track admin accounts |
| `court-images` storage bucket | Store court photos |
| Supabase Auth | Admin login/signup |
| RLS Policies | Secure data access |
| Realtime | Live availability updates |

---

**Next Steps:**
1. Complete Phase 1-6 (Supabase setup)
2. Let me know when ready, and I'll help you implement the code updates (Phase 7-8)
