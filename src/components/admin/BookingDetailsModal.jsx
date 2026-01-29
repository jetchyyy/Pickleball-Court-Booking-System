import { format } from 'date-fns';
import { Calendar, Clock, CreditCard, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { Badge, Button } from '../ui';

export function BookingDetailsModal({ isOpen, onClose, booking, onUpdateStatus }) {
    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                        <p className="text-sm text-gray-500 font-mono">Ref: #{booking.reference}</p>
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
                                        <p className="font-semibold text-gray-900">{booking.name}</p>
                                        <p className="text-xs text-gray-500">Customer Name</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-brand-green mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{booking.email}</p>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-brand-green mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{booking.phone}</p>
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
                                        <span className="font-semibold text-sm">{booking.court?.name}</span>
                                    </div>
                                    <Badge variant={booking.status === 'Confirmed' ? 'green' : 'orange'}>{booking.status}</Badge>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>{booking.date ? format(new Date(booking.date), 'MMMM d, yyyy') : '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>
                                            {booking.times
                                                ? booking.times.sort().join(', ')
                                                : booking.time}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-brand-green/10 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Total Amount ({booking.times?.length || 1} slots)</span>
                                    <span className="font-bold text-lg text-brand-orange">
                                        ₱{(booking.court?.price || 0) * (booking.times?.length || 1)}
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
                            <div className="aspect-[3/4] bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                {/* Mock Image - using a placeholder service or abstract pattern if no real image */}
                                <img
                                    src="https://placehold.co/400x600/e2e8f0/94a3b8?text=Proof+of+Payment%0AReference+No+123456"
                                    alt="Proof of Payment"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button size="sm" variant="secondary">View Full Image</Button>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2 items-start">
                                <div className="mt-0.5 shrink-0">Note:</div>
                                <p>Verify the transaction ID matches your bank records before confirming this booking.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                    <div className="flex gap-2">
                        {booking.status === 'Pending' && (
                            <>
                                <Button onClick={() => { onUpdateStatus(booking.id, 'Cancelled'); onClose(); }} className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                                    Deny Booking
                                </Button>
                                <Button onClick={() => { onUpdateStatus(booking.id, 'Confirmed'); onClose(); }} className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200">
                                    Approve Booking
                                </Button>
                            </>
                        )}
                        {booking.status === 'Confirmed' && (
                            <Button className="bg-brand-green hover:bg-brand-green-dark text-white">Download Receipt</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
