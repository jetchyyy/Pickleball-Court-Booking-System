import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui';

export function AdminCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('bookings') || '[]');

        // Static Demo Data for Jan 1st
        const demoData = [
            {
                id: 'demo-1',
                reference: 'NY-2026-001',
                name: 'Alice Cooper',
                email: 'alice@resort.com',
                phone: '09171234567',
                date: '2026-01-01',
                time: '08:00 AM',
                court: { name: 'Center Court', type: 'Indoor Hard' },
                status: 'Confirmed'
            },
            {
                id: 'demo-2',
                reference: 'NY-2026-002',
                name: 'Bob Marley',
                email: 'bob@music.com',
                phone: '09187654321',
                date: '2026-01-01',
                time: '10:00 AM',
                court: { name: 'Court 1 (Outdoor)', type: 'Outdoor Hard' },
                status: 'Pending'
            },
            {
                id: 'demo-3',
                reference: 'NY-2026-003',
                name: 'Charlie Puth',
                email: 'charlie@pop.com',
                phone: '09198887777',
                date: '2026-01-01',
                time: '04:00 PM',
                court: { name: 'Court 2 (Outdoor)', type: 'Outdoor Hard' },
                status: 'Confirmed'
            }
        ];

        setBookings([...stored, ...demoData]);
    }, []);

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
        return bookings.filter(b => isSameDay(parseISO(b.date), date));
    };

    const selectedDayBookings = getBookingsForDate(selectedDate);

    return (
        <div className="space-y-6">
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
                                        {/* Simplified indicators: just show dots for density */}
                                        {Array.from({ length: Math.min(dayBookings.reduce((acc, b) => acc + (b.times?.length || 1), 0), 4) }).map((_, i) => (
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
                                    .flatMap(b => {
                                        if (b.times && b.times.length > 0) {
                                            return b.times.map(t => ({ ...b, time: t }));
                                        }
                                        return [b];
                                    })
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map((booking, idx) => (
                                        <div key={`${booking.reference}-${booking.time}-${idx}`} className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand-green/30 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-800">{booking.time}</span>
                                                <Badge variant={booking.status === 'Confirmed' ? 'green' : 'orange'}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-sm text-gray-900">{booking.name}</p>
                                            <p className="text-xs text-gray-500">{booking.court?.name}</p>
                                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                                                <span>Ref: {booking.reference}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                <Calendar size={48} className="mb-4 opacity-20" />
                                <p>No bookings for this date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
