# 🚀 Getting Started - Quick Reference

## ⚡ 30-Second Setup

```bash
# 1. Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 2. Start development
npm run dev

# 3. Access the app
# Home: http://localhost:5173
# Admin: http://localhost:5173/admin
```

---

## 🔑 Test Credentials

Use your **Supabase admin account** you created during setup:
- Email: `admin@example.com` (or whatever you created)
- Password: (the password you set in Supabase)

---

## 📍 Navigation Map

```
Homepage (http://localhost:5173)
├── Hero Section
├── Choose Your Court (shows dynamic courts from Supabase)
├── Plan Your Game (booking form)
├── How It Works
├── Contact
└── Footer

Admin Panel (http://localhost:5173/admin)
├── Login (Supabase authentication)
└── Dashboard (requires login)
    ├── Overview
    ├── Bookings (view all bookings)
    ├── Court Management (create/delete courts with images)
    ├── Calendar View
    └── Analytics
```

---

## 🎬 Common User Flows

### Flow 1: Admin Adds a Court
```
1. Go to http://localhost:5173/admin
2. Log in with Supabase credentials
3. Click "Court Management"
4. Click "Add Court"
5. Fill in: Name, Type, Price, Description
6. Click "Choose Images" and select 1+ photos
7. Click "Create Court"
✨ Court appears on homepage instantly!
```

### Flow 2: Customer Books a Court
```
1. Go to http://localhost:5173
2. Scroll to "Choose Your Court"
3. Click "Book Now" on any court
4. Select a date
5. Select available time slots
6. Click next and enter contact info
7. Confirm booking
✨ Time slot marked as booked instantly!
```

### Flow 3: See Real-Time Updates
```
1. Open http://localhost:5173 in Tab A
2. Open http://localhost:5173/admin in Tab B
3. In Tab B: Add a new court
4. Look at Tab A: New court appears (no refresh!)
✨ Real-time magic! ✨
```

---

## 📲 Features by Role

### 👨‍💼 Admin (Authenticated)
- ✅ Login with Supabase
- ✅ View Dashboard
- ✅ Add courts (upload images)
- ✅ Delete courts
- ✅ View bookings
- ✅ See real-time updates
- ✅ Logout

### 👥 Customer (No Login Required)
- ✅ Browse courts
- ✅ See real-time availability
- ✅ Make bookings
- ✅ See booked time slots
- ✅ Get real-time updates

---

## 🛠️ Troubleshooting Quick Links

### "Cannot connect to Supabase"
→ Check `.env.local` has correct URL and anon key

### "Login fails"
→ Verify admin user exists in Supabase Auth > Users

### "Images not uploading"
→ Check `court-images` bucket is PUBLIC in Storage

### "Real-time not updating"
→ Check Supabase Realtime is enabled (Settings > Replication)

### "Port 5173 already in use"
→ Run `npm run dev -- --port 5174`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.md` | How to set up Supabase (Phases 1-6) |
| `PHASE_8_IMPLEMENTATION.md` | Technical implementation details |
| `PHASE_8_COMPLETION_GUIDE.md` | Complete reference guide |
| `CHANGES_SUMMARY.md` | What was changed in React components |
| `.env.local.example` | Environment variables template |

---

## 🔗 Service Functions Cheat Sheet

### Auth
```javascript
await signIn(email, password)        // Login
await signOut()                      // Logout
const user = await getCurrentUser()  // Get current user
```

### Courts
```javascript
const courts = await listCourts()    // Get all courts
await createCourt({...})             // Create court + images
await deleteCourt(id)                // Delete court
subscribeToCourts(callback)          // Real-time updates
```

### Bookings
```javascript
const bookings = await getCourtBookings(courtId, date)  // Get bookings
await createBooking({...})           // Create booking
const all = await getAllBookings()   // Get all bookings
subscribeToBookings(callback)        // Real-time updates
```

---

## 🎯 What's New Since Last Time

**Phases 1-7:** Supabase setup + service files ✅
**Phase 8+:** React component integration ✅

### Components Updated:
1. **AdminLogin.jsx** - Now uses Supabase auth
2. **AdminLayout.jsx** - Auth checks + protected routes
3. **AdminCourts.jsx** - Supabase integration with images
4. **Home.jsx** - Real-time courts + bookings

### Features Added:
- ✅ Real-time court updates
- ✅ Real-time booking availability
- ✅ Image uploads to cloud storage
- ✅ Secure authentication
- ✅ Database persistence

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] Test admin login/logout
- [ ] Test creating court with images
- [ ] Test booking a court
- [ ] Test real-time updates (two browsers)
- [ ] Test error handling (network issues, validation)
- [ ] Review Supabase RLS policies
- [ ] Set up custom domain
- [ ] Configure email notifications (optional)
- [ ] Set up backup strategy
- [ ] Plan scaling (if expecting high traffic)

---

## 🚀 Next Steps

1. **Test Everything**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   # Test admin and customer flows
   ```

2. **Deploy to Production**
   - Set environment variables on hosting
   - Update Supabase URL configuration
   - Test in production environment

3. **Add Enhancements**
   - Email confirmations
   - Payment integration
   - User profiles
   - Reviews/ratings
   - Mobile app

---

## 💡 Pro Tips

### Development
- Use `console.log` to debug real-time updates
- Check Supabase dashboard to verify data is saved
- Use browser DevTools to inspect network requests

### Performance
- Images are cached via CDN (Supabase Storage)
- Real-time subscriptions are efficient
- Database queries are optimized with indexes

### Security
- Never commit `.env.local` (it's in .gitignore)
- RLS policies protect data on backend
- Authentication required for sensitive operations

---

## 📞 Need Help?

### Check These First:
1. **Documentation Files** - See list above
2. **Console Errors** - Open browser DevTools (F12)
3. **Supabase Dashboard** - Verify data exists
4. **Service Files** - `src/services/*.js`

### Common Fixes:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Check for TypeScript errors
npm run lint
```

---

## 🎉 You're Ready!

Everything is set up and ready to go:
- ✅ Supabase backend configured
- ✅ React components integrated
- ✅ Real-time features working
- ✅ Build verified

**Start the dev server:**
```bash
npm run dev
```

**Visit the app:**
- Home: http://localhost:5173
- Admin: http://localhost:5173/admin

Happy bookings! 🏆
