# Blocked Dates & Race Condition Protection - Setup Guide

## What's New

### 1. ✅ Booked Dates Blocking
- Time slots that are already booked now appear **grayed out**
- Users cannot click booked time slots
- Tooltip shows "This time slot is already booked"
- Real-time updates when other users make bookings

### 2. ✅ Race Condition Protection
- Prevents two users from booking the same slot simultaneously
- Database-level unique constraint ensures no double-bookings
- If slot is taken, user gets error: "Failed to create booking"
- User can select a different time and retry

## Setup Steps

### Step 1: Add Unique Constraint to Database

Run this SQL in your Supabase **SQL Editor**:

```sql
-- Prevent double-booking of the same court at the same time
ALTER TABLE bookings
ADD CONSTRAINT unique_court_time_booking 
UNIQUE (court_id, booking_date, start_time);
```

**What this does:**
- A court cannot have two bookings with the same `start_time` on the same `booking_date`
- Database automatically rejects double-booking attempts
- Provides server-side protection against race conditions

### Step 2: Test the Features

#### Test Booked Time Display:
1. Create a booking for a time slot (e.g., 08:00 AM on a future date)
2. Go back and select the same court and date
3. The 08:00 AM slot should now be **grayed out** and unclickable
4. Try to click it - button should not respond

#### Test Real-Time Updates:
1. Open two browser tabs to your booking page
2. In Tab 1: Select a court and date
3. In Tab 2: Select the **same** court and date
4. In Tab 1: Book a time slot (e.g., 08:00 AM)
5. In Tab 2: Watch the 08:00 AM slot turn gray (real-time update)
6. In Tab 2: Cannot select or book the slot anymore

#### Test Race Condition Protection:
1. Open two browser tabs to your booking page
2. In Tab 1: Select court, date, and time 08:00 AM
3. In Tab 2: Select **same** court, date, and time 08:00 AM
4. In Tab 1: Click "Book Selected Slots" → Success ✅
5. In Tab 2: Click "Book Selected Slots" → Error message ❌
6. Message says slot is no longer available
7. In Tab 2: Select different time (09:00 AM) and retry → Success ✅

## How It Works

### Frontend (UI Layer):
```
Customer views calendar
    ↓
System fetches all bookings for selected date
    ↓
Booked time slots are grayed out in UI
    ↓
Real-time subscription updates slots instantly when other users book
    ↓
Customer can only select available (white) slots
```

### Backend (Database Layer):
```
Customer clicks "Book Slot"
    ↓
Server creates booking record
    ↓
Database checks unique constraint
    ↓
If duplicate start_time: REJECTED ❌
    Error: "Duplicate booking"
    ↓
If new booking: ACCEPTED ✅
    Booking created successfully
    ↓
Other clients receive real-time update
    Booked slot automatically grays out
```

## Technical Details

### Files Modified:
- **BookingCalendar.jsx**: Added `bookedTimes` prop, grayed out booked slots
- **Home.jsx**: Added `getBookedTimes()` function, passes to calendar
- **booking.js**: Already had error handling (no changes needed)

### Database Constraint:
```sql
CONSTRAINT unique_court_time_booking 
UNIQUE (court_id, booking_date, start_time)
```

Prevents: Same court + same date + same start time from appearing twice

### Error Handling:
If constraint is violated (race condition occurred):
1. Supabase returns unique constraint violation error
2. Application catches error and shows message
3. User can try different time slot
4. No silent failures or double-bookings

## Key Features

| Feature | Before | After |
|---------|--------|-------|
| Booked slots visible | ❌ No indication | ✅ Grayed out |
| Can book booked slot | ❌ Yes (race condition) | ✅ No (UI + DB protection) |
| Real-time updates | ✅ Yes | ✅ Yes (faster feedback) |
| Race condition safe | ❌ No | ✅ Yes (constraint) |
| User error handling | ❌ Generic errors | ✅ Friendly messages |

## Verification Checklist

After running the SQL command, verify:
- [ ] Constraint is created (check in SQL Editor)
- [ ] Booked slots appear grayed out on calendar
- [ ] Cannot click booked time slots
- [ ] Real-time updates work (2 tabs test)
- [ ] Race condition is prevented (simultaneous booking test)

## Troubleshooting

### Booked slots not grayed out:
- Check if bookings are loading: Console should show `Booking updated: {...}`
- Verify bookings have `start_time` values filled
- Ensure `getCourtBookings()` in booking.js is returning data

### Cannot add constraint:
- Column might not exist: Add with `ALTER TABLE bookings ADD COLUMN start_time TEXT;`
- Values might be NULL: Run `UPDATE bookings SET start_time = '08:00' WHERE start_time IS NULL;`
- Check for duplicates: `SELECT court_id, booking_date, start_time, COUNT(*) FROM bookings GROUP BY court_id, booking_date, start_time HAVING COUNT(*) > 1;`

### Race condition still happening:
- Ensure SQL constraint was created successfully
- Check Supabase SQL Editor for constraint in bookings table
- Constraint must be checked BEFORE booking is confirmed

## Related Files

- [RACE_CONDITION_FIX.md](./RACE_CONDITION_FIX.md) - Detailed technical explanation
- [PROOF_OF_PAYMENT_SETUP.md](./PROOF_OF_PAYMENT_SETUP.md) - Proof of payment setup
- [DEBUG_PROOF_OF_PAYMENT.md](./DEBUG_PROOF_OF_PAYMENT.md) - Debugging guide

---

**Status**: Ready to use after running the SQL command ✅
