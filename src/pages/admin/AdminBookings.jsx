import { format } from 'date-fns';
import { Calendar, CheckCircle, Clock, Eye, MoreVertical, Search, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge, Button } from '../../components/ui';
import { BookingDetailsModal } from '../../components/admin/BookingDetailsModal';

export function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        const stored = JSON.parse(localStorage.getItem('bookings') || '[]');

        // Static Demo Data
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

        setBookings([...stored, ...demoData].reverse());
    };

    const updateStatus = (id, newStatus) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
        setBookings(updated);
        localStorage.setItem('bookings', JSON.stringify(updated.reverse())); // Store in original order (oldest first) or handle sorting
    };

    const deleteBooking = (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        const updated = bookings.filter(b => b.id !== id);
        setBookings(updated);
        localStorage.setItem('bookings', JSON.stringify(updated.reverse()));
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'All') return matchesSearch;
        return matchesSearch && b.status === filterStatus;
    }).sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        // Secondary sort by date (newest first) could go here if needed, but array is already reversed (newest first)
        return 0;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'green';
            case 'Cancelled': return 'red';
            default: return 'orange';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-display text-brand-green-dark">Booking Management</h1>
                    <p className="text-gray-500">View and manage customer bookings</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['All', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`
                                    px-4 py-2 text-sm font-medium rounded-lg transition-all
                                    ${filterStatus === status
                                        ? 'bg-white text-brand-green-dark shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }
                                `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search name, ref..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ref</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No bookings found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.reference} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-medium text-gray-600">#{booking.reference}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{booking.name}</p>
                                                <p className="text-xs text-gray-500">{booking.email}</p>
                                                <p className="text-xs text-gray-500">{booking.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-800">{booking.court?.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date ? format(new Date(booking.date), 'MMM d, yyyy') : '-'}</span>
                                                    <span className="flex items-center gap-1" title={booking.times ? booking.times.join(', ') : booking.time}>
                                                        <Clock size={12} />
                                                        {booking.times
                                                            ? (booking.times.length > 1 ? `${booking.times.length} slots` : booking.times[0])
                                                            : booking.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => { setSelectedBooking(booking); setIsModalOpen(true); }} className="text-gray-500 hover:text-brand-green h-8 w-8 p-0 grid place-items-center" title="View Details">
                                                    <Eye size={16} />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => deleteBooking(booking.id)} className="text-gray-400 hover:text-red-500 h-8 w-8 p-0 grid place-items-center">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BookingDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                booking={selectedBooking}
                onUpdateStatus={updateStatus}
            />
        </div>
    );
}
