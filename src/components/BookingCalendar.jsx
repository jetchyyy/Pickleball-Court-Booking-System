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

export function BookingCalendar({ selectedDate, onDateSelect, selectedTimes = [], onTimeSelect }) {
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

    const timeSlots = [
        { id: '08:00', label: '08:00 AM' },
        { id: '09:00', label: '09:00 AM' },
        { id: '10:00', label: '10:00 AM' },
        { id: '16:00', label: '04:00 PM' },
        { id: '17:00', label: '05:00 PM' },
        { id: '18:00', label: '06:00 PM' },
        { id: '19:00', label: '07:00 PM' },
        { id: '20:00', label: '08:00 PM' },
    ];

    return (
        <div className="space-y-8">
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
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400">
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

                        return (
                            <div key={day.toString()} className="flex justify-center">
                                <button
                                    onClick={() => !isPast && onDateSelect(day)}
                                    disabled={isPast}
                                    className={cn(
                                        'h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-200',
                                        isSelected && 'bg-brand-green text-brand-green-dark font-bold shadow-md',
                                        !isSelected && !isPast && 'hover:bg-brand-green/20 text-gray-700',
                                        !isSelected && isTodayDate && 'border border-brand-green text-brand-green font-semibold',
                                        isPast && 'text-gray-300 cursor-not-allowed'
                                    )}
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

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                        const isSelected = selectedTimes.includes(slot.id);
                        return (
                            <button
                                key={slot.id}
                                onClick={() => onTimeSelect(slot.id)}
                                className={cn(
                                    'py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-200',
                                    isSelected
                                        ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-105'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                                )}
                            >
                                {slot.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
