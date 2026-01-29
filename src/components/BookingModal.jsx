import { format } from 'date-fns';
import { Calendar, CheckCircle, Clock, CreditCard, QrCode, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui';

export function BookingModal({ isOpen, onClose, bookingData, onConfirm }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', reference: '', paymentProof: null });
    const [errors, setErrors] = useState({});

    // Reset step when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({ name: '', phone: '', email: '', reference: '', paymentProof: null });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (formData.phone.length !== 11) newErrors.phone = 'Phone number must be exactly 11 digits';
        if (!formData.email) newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        setStep(2);
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!formData.reference) newErrors.reference = 'Payment reference number is required';
        if (!formData.paymentProof) newErrors.paymentProof = 'Proof of payment is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onConfirm({ ...formData, ...bookingData });
        setStep(3);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200 overflow-hidden">

                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-6">
                    <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-brand-green' : 'bg-gray-100'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-brand-green' : 'bg-gray-100'}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-brand-green' : 'bg-gray-100'}`} />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green-light text-brand-green-dark mb-4">
                        {step === 1 && <CheckCircle size={24} />}
                        {step === 2 && <CreditCard size={24} />}
                        {step === 3 && <CheckCircle size={24} />}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-brand-green-dark">
                        {step === 1 && 'Confirm Booking'}
                        {step === 2 && 'Payment'}
                        {step === 3 && 'Success'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {step === 1 && "You're almost ready to play!"}
                        {step === 2 && "Scan to pay via GCash or Bank Transfer"}
                        {step === 3 && "Booking request received"}
                    </p>
                </div>

                {step === 1 && (
                    /* STEP 1: Details */
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                <span className="text-gray-500 text-sm">Court</span>
                                <span className="font-semibold text-gray-800">{bookingData.court?.name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                <span className="text-gray-500 text-sm flex items-center gap-1"><Calendar size={14} /> Date</span>
                                <span className="font-semibold text-gray-800">
                                    {bookingData.date ? format(bookingData.date, 'MMM do, yyyy') : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                                <span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={14} /> Time(s)</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                                    {bookingData.times ? bookingData.times.sort().join(', ') : bookingData.time}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-gray-500 text-sm">Total Price ({bookingData.times?.length || 1} slots)</span>
                                <span className="font-bold text-brand-orange text-lg">
                                    ₱{(bookingData.court?.price || 0) * (bookingData.times?.length || 1)}
                                </span>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        setErrors({ ...errors, name: '' });
                                    }}
                                    className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all`}
                                    placeholder="Enter your name"
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 11) {
                                            setFormData({ ...formData, phone: val });
                                            setErrors({ ...errors, phone: '' });
                                        }
                                    }}
                                    className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all`}
                                    placeholder="09123456789"
                                    maxLength={11}
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all`}
                                    placeholder="Enter your email"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        </form>

                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
                            <Button className="flex-1" onClick={handleNext}>Next: Pay</Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    /* STEP 2: Payment */
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">

                        {/* QR Code Placeholder/Image */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="mb-4 relative group">
                                {/* Use a placeholder or real image if available */}
                                <img
                                    src="/images/qr-code.jpg"
                                    alt="Payment QR Code"
                                    className="w-48 h-48 object-contain rounded-lg bg-white shadow-sm"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; // Fallback
                                    }}
                                />
                            </div>
                            <p className="text-sm font-medium text-center text-gray-600">Scan via GCash or Bank App</p>
                            <p className="text-xs text-center text-gray-400 mt-1">
                                Amount to pay: <span className="font-bold text-gray-800">
                                    ₱{(bookingData.court?.price || 0) * (bookingData.times?.length || 1)}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference Number</label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => {
                                        setFormData({ ...formData, reference: e.target.value });
                                        setErrors({ ...errors, reference: '' });
                                    }}
                                    className={`w-full px-4 py-2 border ${errors.reference ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all font-mono text-center tracking-wider uppercase`}
                                    placeholder="e.g. 1234 5678 9012"
                                />
                                {errors.reference && <p className="text-xs text-red-500 mt-1 text-center">{errors.reference}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof of Payment</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setFormData({ ...formData, paymentProof: file });
                                                setErrors({ ...errors, paymentProof: '' });
                                            }
                                        }}
                                        className="hidden"
                                        id="payment-proof-upload"
                                    />
                                    <label
                                        htmlFor="payment-proof-upload"
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed ${errors.paymentProof ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-brand-green hover:bg-green-50/50'} rounded-xl cursor-pointer transition-all`}
                                    >
                                        <Upload size={18} className={errors.paymentProof ? 'text-red-400' : 'text-gray-400'} />
                                        <span className={`text-sm ${errors.paymentProof ? 'text-red-500' : 'text-gray-500'}`}>
                                            {formData.paymentProof ? formData.paymentProof.name : 'Click to upload screenshot'}
                                        </span>
                                    </label>
                                </div>
                                {errors.paymentProof && <p className="text-xs text-red-500 mt-1 text-center">{errors.paymentProof}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                            <Button className="flex-1" onClick={handleSubmit}>Submit Booking</Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    /* STEP 3: Success */
                    <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center py-4">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in spin-in-3 duration-500">
                            <CheckCircle size={40} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
                            <p className="text-gray-600 text-base leading-relaxed">
                                Thank you for booking with us.
                            </p>
                            <div className="mt-4 p-4 bg-brand-orange-light/50 border border-brand-orange/20 rounded-xl text-brand-orange-dark text-sm">
                                <p className="font-medium flex items-center justify-center gap-2">
                                    <Clock size={16} /> Status: Pending Approval
                                </p>
                                <p className="mt-2 text-gray-600">
                                    Please wait for the approval text or email confirmation before proceeding to the court.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="w-full" onClick={onClose}>Done</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
