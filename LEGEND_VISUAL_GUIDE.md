# Booking Calendar Legend - Visual Guide

## Legend Display

The calendar now displays a legend at the top showing what each color means:

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ● Available    ● Partially Booked    ● Fully Booked        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Legend Colors

**Available (Light Green border)**
- White circle with green border
- Dates with available time slots
- Can select and book

**Partially Booked (Orange border)**
- Light orange circle with orange border  
- Dates with some booked slots
- Can select and book remaining slots

**Fully Booked (Red)**
- Red circle with darker red border
- All time slots are booked
- Cannot select (disabled)
- Shows tooltip on hover

## Calendar View

### Sample Month Calendar with Legend

```
┌──────────────────────────────────────────────┐
│  ● Available  ● Partially Booked  ● Fully    │
│                                   Booked     │
└──────────────────────────────────────────────┘

            January 2026
    S    M    T    W    T    F    S
                              1    2
    3    4    5    6    7    8    9
   10   11   12   13   14   15   16
   17   18   19   20   21   22   23
   24   25   26   27   28   29   30
   31   1    2    3    4    5    6

Legend:
  ● Normal date = Available (can book)
  ●(G) Green border = Today
  ●(🔴 Red) Fully Booked = All slots taken
  
Examples:
- Date 10 (normal white) = Available, click to see times
- Date 15 (normal white) = Available, click to see times
- Date 22 (RED BACKGROUND) = FULLY BOOKED, cannot click
- Date 25 (normal white) = Available, click to see times
```

## Time Slot Display

When a date is selected:

### Available Date Time Slots
```
Available Times [Select multiple]

08:00 AM    09:00 AM    10:00 AM    04:00 PM
[ white  ]  [ white  ]  [ white  ]  [ white  ]

05:00 PM    06:00 PM    07:00 PM    08:00 PM
[ white  ]  [ white  ]  [ white  ]  [ white  ]

All 8 slots available - customer can select any combination
```

### Partially Booked Date Time Slots
```
Available Times [Select multiple]

08:00 AM    09:00 AM    10:00 AM    04:00 PM
[GRAY ✗]    [ white  ]  [GRAY ✗]    [ white  ]

05:00 PM    06:00 PM    07:00 PM    08:00 PM
[ white  ]  [GRAY ✗]    [ white  ]  [ white  ]

5 slots available, 3 slots booked (grayed out)
Customer can select from the 5 available white slots
```

### Fully Booked Date (Cannot Select)
```
Date 22 - All time slots are booked

(Calendar date appears in RED with red border)
Cannot click on this date
Tooltip: "All time slots are booked for this date"

When hovering over date 22:
🔴 [RED]
All time slots are booked for this date
```

## Visual Styles

### CSS Classes Applied

**Available Date Button**
```css
.date-available {
  background: white;
  border: 1px solid gray-200;
  color: gray-700;
  cursor: pointer;
}

.date-available:hover {
  background: brand-green/20;
}
```

**Today's Date (if available)**
```css
.date-today-available {
  background: white;
  border: 1px solid brand-green;
  color: brand-green;
  font-weight: semibold;
}
```

**Fully Booked Date**
```css
.date-fully-booked {
  background: red-100;
  border: 2px solid red-400;
  color: red-600;
  font-weight: bold;
  cursor: not-allowed;
  opacity: 1; /* Still visible but disabled */
}

.date-fully-booked:hover {
  background: red-100; /* No change on hover */
}

.date-fully-booked:active {
  /* No click response */
}
```

**Past Date (Always disabled)**
```css
.date-past {
  background: white;
  color: gray-300;
  cursor: not-allowed;
  opacity: 0.5;
}
```

## User Experience Flow

### Scenario 1: Customer Looking for Available Slots

```
1. Customer selects a court
   ↓
2. Calendar appears with legend at top
   ↓
3. Customer sees red dates (fully booked) and white dates (available)
   ↓
4. Customer clicks on a white date
   ↓
5. Time slots appear:
   - White = available to book
   - Gray = already booked by others
   ↓
6. Customer selects available time slots
   ↓
7. Customer books the slot
```

### Scenario 2: Customer Tries Fully Booked Date

```
1. Customer notices red date on calendar
   ↓
2. Hovers over red date
   ↓
3. Tooltip appears: "All time slots are booked for this date"
   ↓
4. Customer realizes cannot book on this date
   ↓
5. Customer clicks on nearby white date instead
   ↓
6. Proceeds with booking
```

## Real-Time Updates

When another user books a time slot:

```
Before (Customer A's screen):
08:00 AM [ white ] ← Available

Customer B books 08:00 AM...

After (Both customers' screens update instantly):
08:00 AM [GRAY ✗] ← Booked by Customer B

If ALL slots become booked:
Calendar date changes to RED immediately
```

## Accessibility Features

✅ **Color + Text** - Not relying on color alone for fully booked status
✅ **Tooltip** - Explains why date is disabled
✅ **Disabled State** - Clearly visible and non-clickable
✅ **Large Touch Targets** - 40px buttons work well on mobile
✅ **Keyboard Navigation** - Can tab through available dates

## Mobile Responsiveness

On mobile devices, the legend may wrap to multiple lines:

```
Mobile (< 640px):
┌──────────────────────┐
│ ● Available          │
│ ● Partially Booked   │
│ ● Fully Booked       │
└──────────────────────┘

Desktop (≥ 640px):
┌──────────────────────────────────────┐
│ ● Available  ● Partially Booked      │
│                  ● Fully Booked      │
└──────────────────────────────────────┘
```

## Summary

The legend and visual indicators provide:
- Clear communication of booking status
- Intuitive color coding
- Disabled interaction for fully booked dates
- Real-time updates
- Mobile-friendly design
- Accessible to all users

Users can instantly see:
- Which dates are fully booked (red)
- Which dates have availability (white)
- Which time slots are taken (gray)
- Which dates they can book (clickable)
