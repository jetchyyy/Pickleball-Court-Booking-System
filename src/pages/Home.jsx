import { startOfToday } from 'date-fns';
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
            setActiveCourts(courts || []);
        } catch (err) {
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
            const dateStr = selectedDate.toISOString().split('T')[0];
            const bookings = await getCourtBookings(
                selectedCourt.id,
                dateStr
            );
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
        if (!courtBookings || courtBookings.length === 0) {
            return [];
        }

        const bookedSlots = [];
        courtBookings.forEach(booking => {
            if (booking.start_time) {
                // Normalize time format: remove seconds if present (10:00:00 -> 10:00)
                const timeWithoutSeconds = booking.start_time.substring(0, 5);
                bookedSlots.push(timeWithoutSeconds);
            }
        });
        return bookedSlots;
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

            // Extract start and end times from the first time slot
            const firstTimeSlot = bookingData.times?.[0] || bookingData.time;
            let startTime = '08:00';
            let endTime = '09:00';

            if (firstTimeSlot && typeof firstTimeSlot === 'string') {
                if (firstTimeSlot.includes('-')) {
                    const parts = firstTimeSlot.split('-');
                    if (parts[0] && parts[1]) {
                        startTime = parts[0].trim();
                        endTime = parts[1].trim();
                    }
                } else {
                    startTime = firstTimeSlot.trim();
                    const [hours, minutes] = startTime.split(':');
                    const endHour = parseInt(hours) + 1;
                    endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;
                }
            }

            // Create booking first
            const newBooking = await createBooking({
                courtId: selectedCourt.id,
                customerName: bookingData.name,
                customerEmail: bookingData.email,
                customerPhone: bookingData.phone,
                bookingDate: selectedDate.toISOString().split('T')[0],
                startTime: startTime,
                endTime: endTime,
                totalPrice: bookingData.totalPrice || 0,
                notes: bookingData.reference || '',
                proofOfPaymentUrl: null
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
                    const { data: updateData, error: updateError } = await supabase
                        .from('bookings')
                        .update({ proof_of_payment_url: proofOfPaymentUrl })
                        .eq('id', newBooking.id)
                        .select();

                    if (updateError) {
                        // Booking is still successful, just log the error
                    }
                } catch (uploadErr) {
                    // Booking is still successful, just log the error
                }
            }

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