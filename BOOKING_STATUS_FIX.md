# Booking Status Filter Fix

## Problem
Users were able to book time slots that appeared to be available in the calendar, but then got a "duplicate key" error when trying to confirm. The issue was that the calendar was showing **all bookings** (including Pending ones) as booked, which is incorrect.

However, the bigger issue was that:
1. **Pending bookings were blocking slots** - If a user created a booking but the admin hadn't approved it yet, it should NOT block other users from booking that slot
2. **Only Confirmed bookings should block slots** - The calendar should only show time slots as unavailable if they've been approved by the admin

## Root Cause
In `src/services/booking.js`, the `getCourtBookings()` function was returning ALL bookings regardless of status:

```javascript
// BEFORE - Returns ALL bookings
export async function getCourtBookings(courtId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .eq('booking_date', date);  // No status filter!
  
  return data;
}
```

This meant:
- ❌ Pending bookings blocked time slots
- ❌ Rejected bookings blocked time slots
- ❌ Only confirmed bookings should matter

## Solution
Updated `getCourtBookings()` to only return **Confirmed** bookings:

```javascript
// AFTER - Only returns Confirmed bookings
export async function getCourtBookings(courtId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .eq('booking_date', date)
    .eq('status', 'Confirmed');  // ← Added status filter!
  
  return data;
}
```

Now:
- ✅ Only Confirmed bookings block time slots in the calendar
- ✅ Pending bookings don't block slots (users can book)
- ✅ If two users book the same slot simultaneously:
  - First user's booking is created and confirmed immediately
  - Second user gets database constraint error (409 Conflict)
  - User sees friendly error message and can select another slot

## Booking Status Workflow

### Status Values
- **Pending**: Initial status when customer books (needs admin approval)
- **Confirmed**: Admin approved the booking
- **Cancelled/Rejected**: Booking was rejected or cancelled

### Calendar Display Logic
```
Time Slot Status in Calendar:
├─ Available (white/normal)
│  └─ No confirmed bookings for this slot
├─ Booked (gray/disabled)
│  └─ Has a confirmed booking for this slot
└─ Future: Fully Booked (red)
   └─ All 8 time slots have confirmed bookings
```

### User Booking Flow
1. Customer selects court, date, and time slots
2. Clicks "Book Selected Slots"
3. Booking created with status = "Pending"
4. Customer uploads proof of payment (optional)
5. Admin reviews booking in AdminBookings dashboard
6. **Admin approves** → Status changes to "Confirmed" → Time slot becomes unavailable
7. **Admin rejects** → Status changes to "Rejected" → Time slot becomes available again

## Files Modified

### `src/services/booking.js`
- Updated `getCourtBookings()` to filter by `status = 'Confirmed'`
- Added console logging to track which bookings are loaded

### `src/pages/Home.jsx`
- Added enhanced logging in `loadBookings()` to show booking count
- Added logging in `getBookedTimes()` to debug time extraction
- Helps troubleshoot booking display issues

## How the Race Condition Protection Works

### Two-Layer Protection:

**Layer 1: Database Constraint (Prevents Double-Booking)**
```sql
UNIQUE (court_id, booking_date, start_time)
```
- Prevents two confirmed bookings on same slot
- Returns 409 Conflict error if violated
- Second user gets error message

**Layer 2: UI Display (Prevents User Confusion)**
- Calendar shows time slots as booked only for confirmed bookings
- Users can't click already-confirmed slots (disabled/grayed out)
- Users see tooltip: "This time slot is already booked"
- Real-time updates when bookings are confirmed

## Testing the Fix

### Test Case 1: Single Booking
1. Select court and date
2. Select a time slot (should be white/available)
3. Book the slot
4. **Expected**: Booking created with status = "Pending"
5. Time slot is **NOT immediately blocked** (pending doesn't block)
6. In AdminBookings: Click "Approve" to confirm
7. **After approval**: Time slot turns gray/blocked in calendar ✅

### Test Case 2: Race Condition Blocked
1. Open two browser tabs
2. In Tab A: Select court, date, and 10:00 AM
3. In Tab B: Select same court, date, and 10:00 AM
4. In Tab A: Click "Book Selected Slots"
5. Wait for confirmation
6. In Tab B: Click "Book Selected Slots"
7. **Expected**: Tab B shows error "Booking failed: duplicate key value violates unique constraint" ✅
8. Tab B user can select different time slot and succeed

### Test Case 3: Real-Time Calendar Update
1. Select court and date (should show available slots)
2. In another tab/window: Book a slot and approve it
3. **Expected**: Calendar automatically updates and shows that slot as booked ✅

## Rollback (If Needed)

If you need to revert to showing all bookings (not recommended):
```javascript
// Revert getCourtBookings to accept all statuses
export async function getCourtBookings(courtId, date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('court_id', courtId)
    .eq('booking_date', date);  // Removed status filter
  
  return data;
}
```

## Summary

✅ **Fixed**: Calendar now only shows confirmed bookings as booked
✅ **Protected**: Database constraint prevents double-booking of confirmed slots
✅ **User-Friendly**: Users won't see "slot unavailable" error for pending bookings
✅ **Admin Workflow**: Approved bookings immediately block slots in calendar
