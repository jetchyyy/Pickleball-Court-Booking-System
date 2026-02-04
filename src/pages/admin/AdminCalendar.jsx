import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui';
import { getAllBookings, subscribeToBookings, updateBookingStatus } from '../../services/booking';
import { BookingDetailsModal } from '../../components/admin/BookingDetailsModal';

export function AdminCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBookings();

        // Subscribe to real-time updates
        const subscription = subscribeToBookings(() => {
            loadBookings();
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            setBookings(data || []);
        } catch (err) {
            console.error('Error loading bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const firstDayNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const firstDayPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getBookingsForDate = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return bookings.filter(b => b.booking_date === dateStr && b.status !== 'Cancelled');
    };

    const selectedDayBookings = getBookingsForDate(selectedDate);

    const handleBookingClick = (booking) => {
        setSelectedBookingDetails(booking);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 w-full max-w-full">
            <div>
                <h1 className="text-2xl font-bold font-display text-brand-green-dark">Calendar Schedule</h1>
                <p className="text-gray-500">Overview of efficient court utilization</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Calendar Grid */}
                <div className="lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-800">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={firstDayPrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={firstDayNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-4 mb-4">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, dayIdx) => {
                            const dayBookings = getBookingsForDate(day);
                            const isSelected = isSameDay(day, selectedDate);
                            const isCurrentMonth = isSameMonth(day, currentMonth);

                            return (
                                <button
                                    key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        min-h-[80px] p-2 rounded-xl text-left transition-all relative
                                        ${isSelected ? 'ring-2 ring-brand-green bg-brand-green/5' : 'hover:bg-gray-50'}
                                        ${!isCurrentMonth ? 'opacity-40' : ''}
                                    `}
                                >
                                    <span className={`
                                        text-sm font-medium block mb-1
                                        ${isSelected ? 'text-brand-green-dark' : 'text-gray-700'}
                                    `}>
                                        {format(day, 'd')}
                                    </span>

                                    {/* Indicators */}
                                    <div className="space-y-1">
                                        {/* Show dots for each booking on this date (max 4) */}
                                        {Array.from({ length: Math.min(dayBookings.length, 4) }).map((_, i) => (
                                            <div key={i} className="h-1.5 rounded-full bg-brand-orange w-full opacity-80"></div>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Day Detail View */}
                <div className="lg:w-1/3 space-y-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Schedule for <span className="text-brand-green-dark">{format(selectedDate, 'MMM do')}</span>
                    </h2>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 min-h-[400px]">
                        {selectedDayBookings.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDayBookings
                                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                                    .map((booking) => (
                                        <div
                                            key={booking.id}
                                            onClick={() => handleBookingClick(booking)}
                                            className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand-green/30 hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-800">{booking.start_time} - {booking.end_time}</span>
                                                <Badge variant={booking.status === 'Confirmed' ? 'green' : booking.status === 'Cancelled' ? 'red' : 'orange'}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-sm text-gray-900">{booking.customer_name}</p>
                                            <p className="text-xs text-gray-500">{booking.courts?.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-400 mt-1">₱{booking.total_price}</p>
                                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                                                <span>ID: {booking.id.substring(0, 8)}</span>
                                                <span className="text-brand-green font-medium">View Details →</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                <Calendar size={48} className="mb-4 opacity-20" />
                                <p>{loading ? 'Loading bookings...' : 'No bookings for this date.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BookingDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                booking={selectedBookingDetails}
                onUpdateStatus={async (id, status) => {
                    await updateBookingStatus(id, status); // Need to import this
                    loadBookings();
                }}
            />
        </div>
    );
}
