# Race Condition & Booking Conflict Prevention

## Database-Level Protection (Race Condition Fix)

To prevent two users from booking the same time slot simultaneously, we need to add a unique constraint at the database level.

### Step 1: Add Unique Constraint to Prevent Double-Booking

Run this SQL in your Supabase **SQL Editor**:

```sql
-- Add unique constraint to prevent double-booking
-- A court cannot have two bookings at the same time on the same date
ALTER TABLE bookings
ADD CONSTRAINT unique_court_time_booking 
UNIQUE (court_id, booking_date, start_time);
```

This ensures that:
- The same court cannot have two bookings starting at the same time on the same date
- If a second user tries to book an already-booked slot, the database will reject it with a constraint violation
- The application will catch this error and show a user-friendly message

### Step 2: Update Application Error Handling

The application already handles constraint violations gracefully:
- If a second user books the same slot, they'll get an error message
- The error message tells them the slot is no longer available
- They can select a different slot and try again

## How It Works

### Before (Race Condition Vulnerable):
1. User A sees slot 08:00 AM available
2. User B sees slot 08:00 AM available
3. User A clicks "Book" → Booking created for 08:00 AM
4. User B clicks "Book" → Booking ALSO created for 08:00 AM (DOUBLE BOOKING!) ❌

### After (Protected):
1. User A sees slot 08:00 AM available
2. User B sees slot 08:00 AM available
3. User A clicks "Book" → Booking created for 08:00 AM
4. User B clicks "Book" → Database rejects (constraint violation)
5. User B gets message: "This time slot is no longer available. Please select another time."
6. User B can select a different time slot ✅

## Frontend Protection (User Experience)

The frontend now also shows:
- ✅ Booked time slots appear **grayed out** and disabled
- ✅ Tooltip shows "This time slot is already booked"
- ✅ Real-time updates when bookings change
- ✅ Users cannot click already-booked slots

## Implementation Details

### Files Modified:
1. **BookingCalendar.jsx**
   - Added `bookedTimes` prop to receive list of booked times
   - Grayed out and disabled booked time slots
   - Added hover tooltip for booked slots

2. **Home.jsx**
   - Added `getBookedTimes()` function to extract start times from bookings
   - Passes booked times to BookingCalendar
   - Already has error handling for constraint violations

3. **booking.js**
   - Already handles Supabase errors gracefully
   - Will catch and report unique constraint violations

### Database Constraint:
- **Name**: `unique_court_time_booking`
- **Prevents**: court_id + booking_date + start_time from being duplicated
- **Effect**: Blocks race condition double-bookings

## Testing the Protection

### Test Case 1: Single User Booking
1. Select a court, date, and time
2. Book the slot
3. The time slot should now be grayed out
4. Cannot select it again ✅

### Test Case 2: Race Condition Simulation
1. Open two browser windows/tabs to the same page
2. In Window A: Select slot 08:00 AM
3. In Window B: Select the same slot 08:00 AM
4. In Window A: Click "Book Selected Slots"
5. In Window B: Click "Book Selected Slots"
6. Window B should show an error: "Failed to create booking"
7. Window A successfully books the slot ✅

### Test Case 3: Real-Time Update
1. Book a slot in Window A
2. Window B should automatically gray out that slot
3. Verify the slot is no longer available in Window B ✅

## Rollback (If Needed)

If you need to remove the constraint:
```sql
ALTER TABLE bookings
DROP CONSTRAINT unique_court_time_booking;
```

## Performance Notes

- Constraint check is very fast (indexed)
- No performance impact on lookups
- Only affects INSERT operations (minimal overhead)
- Recommended for production use
