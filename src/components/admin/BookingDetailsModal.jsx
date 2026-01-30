import { format } from 'date-fns';
import { Calendar, Clock, CreditCard, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { Badge, Button } from '../ui';

export function BookingDetailsModal({ isOpen, onClose, booking, onUpdateStatus }) {
    if (!isOpen || !booking) return null;

    // Debug logging
    console.log('BookingDetailsModal - Booking data:', {
        id: booking.id,
        customer_name: booking.customer_name,
        total_price: booking.total_price,
        total_price_type: typeof booking.total_price,
        proof_url: booking.proof_of_payment_url,
        url_exists: !!booking.proof_of_payment_url,
        all_keys: Object.keys(booking).sort()
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                        <p className="text-sm text-gray-500 font-mono">ID: {booking.id?.substring(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-8">
                    {/* Left Column: Booking Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User size={18} className="text-brand-green mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{booking.customer_name}</p>
                                        <p className="text-xs text-gray-500">Customer Name</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-brand-green mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{booking.customer_email}</p>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-brand-green mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{booking.customer_phone}</p>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Booking Details</h3>
                            <div className="bg-brand-green-light/30 rounded-xl p-4 border border-brand-green/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-brand-green-dark">
                                        <MapPin size={16} />
                                        <span className="font-semibold text-sm">{booking.courts?.name || 'Court'}</span>
                                    </div>
                                    <Badge variant={booking.status === 'Confirmed' ? 'green' : booking.status === 'Cancelled' ? 'red' : 'orange'}>{booking.status}</Badge>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>{booking.booking_date ? format(new Date(booking.booking_date), 'MMMM d, yyyy') : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>{booking.start_time} - {booking.end_time}</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-brand-green/10 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Total Amount</span>
                                    <span className="font-bold text-lg text-brand-orange">
                                        ₱{booking.total_price || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Proof of Payment */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CreditCard size={14} /> Proof of Payment
                        </h3>
                        <div className="space-y-3">
                            {booking.proof_of_payment_url ? (
                                <div className="aspect-[3/4] bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                    <img
                                        src={booking.proof_of_payment_url}
                                        alt="Proof of Payment"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x600?text=Failed+to+load';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a
                                            href={booking.proof_of_payment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                        >
                                            View Full Image
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[3/4] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <CreditCard size={40} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No proof of payment uploaded</p>
                                    </div>
                                </div>
                            )}
                            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2 items-start">
                                <div className="mt-0.5 shrink-0">Note:</div>
                                <p>Bookings are automatically confirmed when customers submit payment. Verify proof of payment to ensure legitimacy.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    <div className="flex gap-2">
                        {booking.status === 'Confirmed' && (
                            <>
                                <Button onClick={() => { onUpdateStatus(booking.id, 'Cancelled'); onClose(); }} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                                    Cancel Booking
                                </Button>
                                <Button className="bg-brand-green hover:bg-brand-green-dark text-white">Download Receipt</Button>
                            </>
                        )}
                        {booking.status === 'Cancelled' && (
                            <p className="text-sm text-gray-500 py-2">This booking has been cancelled</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
