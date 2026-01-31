import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isBefore,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfToday,
    subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from './ui';

export function BookingCalendar({ selectedDate, onDateSelect, selectedTimes = [], onTimeSelect, bookedTimes = [], fullyBookedDates = [] }) {
    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

    // Generate days for the current month view
    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Calculate starting empty slots (0 = Sunday, 1 = Monday, etc.)
    const startingDayIndex = getDay(startOfMonth(currentMonth));

    // Previous and Next Month handlers
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Generate 24-hour time slots
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        const period = i < 12 ? 'AM' : 'PM';
        const displayHour = i === 0 ? 12 : (i > 12 ? i - 12 : i);
        const displayHourStr = displayHour.toString().padStart(2, '0');
        return {
            id: `${hour}:00`,
            label: `${displayHourStr}:00 ${period}`
        };
    });

    return (
        <div className="space-y-8">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 items-center text-sm px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border border-brand-green"></div>
                    <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-brand-orange/30 border border-brand-orange"></div>
                    <span className="text-gray-700">Partially Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-100 border border-red-400"></div>
                    <span className="text-gray-700">Fully Booked</span>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg text-brand-green-dark">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={prevMonth}
                            disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(today))} // Prevent going back past current month context roughly
                            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                        >
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-2 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-400">
                            {day}
                        </div>
                    ))}

                    {/* Empty slots for start of month */}
                    {Array.from({ length: startingDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {days.map((day, dayIdx) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isPast = isBefore(day, today);
                        const isTodayDate = isSameDay(day, today);
                        const isFullyBooked = fullyBookedDates.some(d => isSameDay(d, day));

                        return (
                            <div key={day.toString()} className="flex justify-center relative">
                                <button
                                    onClick={() => !isPast && onDateSelect(day)}
                                    disabled={isPast}
                                    className={cn(
                                        'h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative',
                                        isSelected && 'bg-brand-green text-brand-green-dark font-bold shadow-md',
                                        !isSelected && isPast && 'text-gray-300 cursor-not-allowed',
                                        !isSelected && !isPast && isFullyBooked && 'bg-red-100 border-2 border-red-400 text-red-600 font-semibold cursor-not-allowed hover:bg-red-100',
                                        !isSelected && !isPast && !isFullyBooked && 'hover:bg-brand-green/20 text-gray-700',
                                        !isSelected && isTodayDate && !isFullyBooked && 'border border-brand-green text-brand-green font-semibold',
                                    )}
                                    title={isFullyBooked ? 'All time slots are booked for this date' : undefined}
                                >
                                    {format(day, 'd')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg text-brand-green-dark flex items-center gap-2">
                        <Clock size={18} /> Available Times
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Select multiple</span>
                </div>

                <div className="space-y-6">
                    {/* Time Sections */}
                    {[
                        { title: 'Morning (6AM - 11AM)', range: [6, 7, 8, 9, 10, 11] },
                        { title: 'Afternoon (12PM - 5PM)', range: [12, 13, 14, 15, 16, 17] },
                        { title: 'Evening (6PM - 11PM)', range: [18, 19, 20, 21, 22, 23] },
                        { title: 'Late Night (12AM - 5AM)', range: [0, 1, 2, 3, 4, 5], note: 'Strictly no Walk-ins' },
                    ].map((section, idx) => {
                        // Filter slots for this section
                        const sectionSlots = timeSlots.filter(slot => {
                            const hour = parseInt(slot.id.split(':')[0]);
                            return section.range.includes(hour);
                        });

                        if (sectionSlots.length === 0) return null;

                        return (
                            <div key={idx} className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    {section.title}
                                    {section.note && (
                                        <span className="text-brand-orange text-xs normal-case font-bold px-2 py-0.5 bg-orange-50 rounded-full border border-orange-100">
                                            {section.note}
                                        </span>
                                    )}
                                </h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {sectionSlots.map((slot) => {
                                        const isSelected = selectedTimes.includes(slot.id);
                                        const isBooked = bookedTimes.includes(slot.id);
                                        return (
                                            <button
                                                key={slot.id}
                                                onClick={() => !isBooked && onTimeSelect(slot.id)}
                                                disabled={isBooked}
                                                className={cn(
                                                    'py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-200',
                                                    isBooked
                                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                                        : isSelected
                                                            ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-105'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                                                )}
                                                title={isBooked ? 'This time slot is already booked' : undefined}
                                            >
                                                {slot.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
