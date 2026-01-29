import { startOfToday } from 'date-fns';
import { useState, useEffect } from 'react';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingModal } from '../components/BookingModal';
import { Button } from '../components/ui';
import { Contact } from '../components/Contact';
import { CourtCard } from '../components/CourtCard';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { Navbar } from '../components/Navbar';

import { courts } from '../data/courts';

export function Home() {
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCourts, setActiveCourts] = useState(courts);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const storedCourts = localStorage.getItem('courts');
        if (storedCourts) {
            setActiveCourts(JSON.parse(storedCourts));
        }
    }, []);

    const handleBookClick = (court) => {
        setSelectedCourt(court);
        setValidationError('');
        // Scroll to calendar section
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleBookingConfirm = (bookingData) => {
        // Save to localStorage for Admin Dashboard demo
        const newBooking = {
            id: Date.now(),
            ...bookingData,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        localStorage.setItem('bookings', JSON.stringify([...existingBookings, newBooking]));

        console.log("Booking Confirmed:", newBooking);
        // Alert removed. Modal handles success.
        // Do NOT close modal here. Let the Success step 'Done' button handle it via onClose.
        setSelectedTimes([]);
        setSelectedCourt(null);
    };

    return (
        <div className="min-h-screen bg-bg-light font-sans text-brand-green-dark selection:bg-brand-orange-light selection:text-brand-orange">
            <Navbar />
            <Hero />

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
