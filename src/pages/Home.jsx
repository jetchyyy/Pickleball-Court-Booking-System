import { startOfToday, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingModal } from '../components/BookingModal';
import { Button } from '../components/ui';
import { Contact } from '../components/Contact';
import { Offers } from '../components/Offers';
import { Parking } from '../components/Parking';
import { CourtCard } from '../components/CourtCard';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { Navbar } from '../components/Navbar';
import { listCourts, subscribeToCourts } from '../services/courts';
import { getCourtBookings, subscribeToBookings } from '../services/booking';

export function Home() {
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCourts, setActiveCourts] = useState([]);
    const [courtBookings, setCourtBookings] = useState([]);
    const [validationError, setValidationError] = useState('');
    const [loading, setLoading] = useState(false);

    // Load courts from Supabase
    useEffect(() => {
        loadCourts();

        // Subscribe to court updates
        const subscription = subscribeToCourts((payload) => {
            loadCourts();
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const loadCourts = async () => {
        try {
            const courts = await listCourts();
            // Filter out disabled courts (default is active if not specified)
            const activeCourts = (courts || []).filter(court => court.is_active !== false);
            setActiveCourts(activeCourts);
        } catch (err) {
            console.error('Error loading courts:', err);
            // Fallback to empty array
            setActiveCourts([]);
        }
    };

    // Load bookings when court or date changes
    useEffect(() => {
        if (selectedCourt) {
            loadBookings();

            // Subscribe to booking updates for this court
            const subscription = subscribeToBookings((payload) => {
                loadBookings();
            });

            return () => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            };
        }
    }, [selectedCourt, selectedDate]);

    const loadBookings = async () => {
        if (!selectedCourt) return;

        try {
            setLoading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            // Fetch ALL bookings for the day to check for exclusive court conflicts
            const { getDailyBookings } = await import('../services/booking');
            const bookings = await getDailyBookings(dateStr);
            setCourtBookings(bookings || []);
        } catch (err) {
            setCourtBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (court) => {
        setSelectedCourt(court);
        setValidationError('');
        // Scroll to calendar section
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Get booked time slots for the selected date
    const getBookedTimes = () => {
        const bookedSlots = new Set();
        
        // Block past time slots if selected date is today
        const today = startOfToday();
        const isToday = format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        
        if (isToday) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Block all time slots that have already passed
            for (let hour = 0; hour <= currentHour; hour++) {
                // If it's the current hour, check if we're past the start of the slot
                if (hour === currentHour) {
                    // Block this hour only if we're past the start (e.g., if it's 1:47 AM, block 1:00 AM)
                    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                    bookedSlots.add(timeSlot);
                } else {
                    // Block all previous hours
                    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                    bookedSlots.add(timeSlot);
                }
            }
        }
        
        // Continue with existing booking conflict logic
        if (!courtBookings || courtBookings.length === 0) {
            return Array.from(bookedSlots);
        }

        const isExclusiveSelected = selectedCourt?.type?.includes('Exclusive') || selectedCourt?.type?.includes('Whole');

        courtBookings.forEach(booking => {
            // Check for conflict
            let isConflict = false;

            // 1. Direct conflict: Same court
            if (booking.court_id === selectedCourt.id) {
                isConflict = true;
            }
            // 2. Exclusive Conflict: 
            // If we selected an Exclusive court, ANY booking on ANY court is a conflict
            else if (isExclusiveSelected) {
                isConflict = true;
            }
            // 3. Reverse Exclusive Conflict:
            // If we selected a normal court, but the booking is on an Exclusive court
            else if (booking.courts?.type?.includes('Exclusive') || booking.courts?.type?.includes('Whole')) {
                isConflict = true;
            }

            if (isConflict && booking.start_time && booking.end_time) {
                // Normalize time format: remove seconds if present (10:00:00 -> 10:00)
                const startTime = booking.start_time.substring(0, 5);
                const endTime = booking.end_time.substring(0, 5);

                // If booking has specific booked_times array, only block those times
                if (booking.booked_times && Array.isArray(booking.booked_times) && booking.booked_times.length > 0) {
                    booking.booked_times.forEach(time => {
                        const normalizedTime = time.substring(0, 5);
                        bookedSlots.add(normalizedTime);
                    });
                } else {
                    // Fallback: block all hours between start_time and end_time (legacy support)
                    const [startHour, startMin] = startTime.split(':').map(Number);
                    const [endHour, endMin] = endTime.split(':').map(Number);

                    // Add all hours from start to end
                    for (let hour = startHour; hour < endHour; hour++) {
                        const timeSlot = `${hour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
                        bookedSlots.add(timeSlot);
                    }
                }
            }
        });
        return Array.from(bookedSlots);
    };

    // Get list of fully booked dates (all time slots booked)
    const getFullyBookedDates = () => {
        if (!selectedCourt || activeCourts.length === 0) return [];

        // Define all time slots
        // Define all time slots (24 hours)
        const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

        // Group bookings by date
        const bookingsByDate = {};
        activeCourts.forEach(court => {
            if (court.id === selectedCourt.id) {
                // This will be populated as we load bookings for different dates
                // For now, just return empty for simplicity
            }
        });

        // Note: This feature requires fetching bookings for all dates, not just selected date
        // For MVP, we'll show "Fully Booked" only for dates where we have all 8 slots booked
        const bookedDates = {};

        // We'd need to load all bookings for the court to accurately determine fully booked dates
        // This is a future enhancement - for now return empty
        return [];
    };

    const bookedTimes = getBookedTimes();
    const fullyBookedDates = getFullyBookedDates();

    const handleBookingConfirm = async (bookingData) => {
        try {
            const { createBooking, uploadProofOfPayment } = await import('../services/booking');

            // Get all selected time slots
            const timeSlots = bookingData.times && bookingData.times.length > 0
                ? bookingData.times
                : [bookingData.time];

            if (!timeSlots || timeSlots.length === 0) {
                throw new Error('No time slots selected');
            }

            // Sort time slots
            const sortedSlots = [...timeSlots].sort();
            const firstSlot = sortedSlots[0];
            const lastSlot = sortedSlots[sortedSlots.length - 1];

            // Calculate start time from first slot
            let startTime = '08:00';
            if (firstSlot && typeof firstSlot === 'string') {
                if (firstSlot.includes('-')) {
                    startTime = firstSlot.split('-')[0].trim();
                } else {
                    startTime = firstSlot.trim();
                }
            }

            // Calculate end time from last slot (1 hour after last slot start)
            let endTime = '09:00';
            if (lastSlot && typeof lastSlot === 'string') {
                let lastSlotTime = lastSlot.trim();
                if (lastSlot.includes('-')) {
                    lastSlotTime = lastSlot.split('-')[0].trim();
                }
                const [hours, minutes] = lastSlotTime.split(':');
                const endHour = parseInt(hours) + 1;
                endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;
            }

            console.log(`Creating single booking: ${startTime} - ${endTime} for ${sortedSlots.length} selected slots`);
            console.log(`Booked times: ${sortedSlots.join(', ')}`);

            // Create a SINGLE booking with booked_times containing the specific slots
            const newBooking = await createBooking({
                courtId: selectedCourt.id,
                customerName: bookingData.name,
                customerEmail: bookingData.email,
                customerPhone: bookingData.phone,
                bookingDate: format(selectedDate, 'yyyy-MM-dd'),
                startTime: startTime,
                endTime: endTime,
                totalPrice: bookingData.totalPrice || 0,
                notes: bookingData.reference || '',
                proofOfPaymentUrl: null,
                bookedTimes: sortedSlots
            });

            // Try to upload proof of payment if file exists
            if (bookingData.paymentProof) {
                try {
                    const proofOfPaymentUrl = await uploadProofOfPayment(bookingData.paymentProof, newBooking.id);

                    if (!proofOfPaymentUrl) {
                        throw new Error('No URL returned from upload');
                    }

                    // Update booking with proof of payment URL
                    const { supabase } = await import('../lib/supabaseClient');
                    const { error: updateError } = await supabase
                        .from('bookings')
                        .update({ proof_of_payment_url: proofOfPaymentUrl })
                        .eq('id', newBooking.id)
                        .select();

                    if (updateError) {
                        console.error('Error updating booking with proof:', updateError);
                    }
                } catch (uploadErr) {
                    console.error('Failed to upload proof of payment:', uploadErr);
                }
            }

            console.log("Booking Confirmed:", newBooking);
            await loadBookings();
            setSelectedTimes([]);
            setIsModalOpen(false);
        } catch (err) {
            // Reload bookings to show updated availability
            await loadBookings();

            // Check if it's a race condition error (duplicate key constraint)
            let userFriendlyMessage = 'Failed to create booking. Please try again.';
            if (err.message && err.message.includes('unique constraint')) {
                userFriendlyMessage = '⚠️ Sorry! One or more selected time slots were just booked by another customer. Please select different times and try again.';
            } else if (err.message) {
                userFriendlyMessage = `Error: ${err.message}`;
            }

            setValidationError(userFriendlyMessage);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light font-sans text-brand-green-dark selection:bg-brand-orange-light selection:text-brand-orange">
            <Navbar />
            <Hero />
            <Offers />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20">

                {/* Courts Section */}
                <section id="courts">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Choose Your Court</h2>
                        <p className="text-gray-600">Select from our professional-grade courts. Whether you prefer center court action or a casual game, we have the perfect spot for you.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeCourts.map((court) => (
                            <CourtCard key={court.id} court={court} onBook={handleBookClick} />
                        ))}
                    </div>
                </section>

                {/* Booking Section */}
                <section id="booking-section" className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/3 space-y-6">
                        <div className="inline-block px-3 py-1 bg-brand-orange-light text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                            Step 1 & 2
                        </div>
                        <h2 className="text-3xl font-display font-bold">Plan Your Game</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Select a date and time that works for you. Our real-time availability ensures you get the slot you want.
                            <br /><br />
                            {selectedCourt ? (
                                <span className="block p-4 bg-brand-green-light rounded-xl border border-brand-green/20">
                                    You are booking: <span className="font-bold block text-lg">{selectedCourt.name}</span>
                                </span>
                            ) : (
                                <span className="block p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 text-sm">
                                    Please select a court in the section above to proceed.
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="lg:w-2/3">
                        <BookingCalendar
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            selectedTimes={selectedTimes}
                            bookedTimes={bookedTimes}
                            fullyBookedDates={fullyBookedDates}
                            onTimeSelect={(time) => {
                                // Toggle time selection
                                const newTimes = selectedTimes.includes(time)
                                    ? selectedTimes.filter(t => t !== time)
                                    : [...selectedTimes, time];

                                setSelectedTimes(newTimes);
                                if (newTimes.length > 0) setValidationError('');

                                // Optional: Auto-scroll or hint if needed, but don't force modal open immediately on multi-select
                            }}
                        />
                        <div className="mt-6 flex flex-col items-end gap-2">
                            {validationError && (
                                <p className="text-sm font-medium text-red-500 animate-bounce">
                                    {validationError}
                                </p>
                            )}
                            <Button
                                size="lg"
                                onClick={() => {
                                    setValidationError('');
                                    if (!selectedCourt) {
                                        setValidationError("⚠️ Please select a court first!");
                                        document.getElementById('courts')?.scrollIntoView({ behavior: 'smooth' });
                                        return;
                                    }
                                    if (selectedTimes.length === 0) {
                                        setValidationError("⚠️ Please select at least one time slot.");
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                            >
                                Book Selected Slots ({selectedTimes.length})
                            </Button>
                        </div>
                    </div>
                </section>

            </main>

            <Contact />
            <Parking />
            <Footer />

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookingData={{ court: selectedCourt, date: selectedDate, times: selectedTimes }}
                onConfirm={handleBookingConfirm}
            />
        </div>
    );
}