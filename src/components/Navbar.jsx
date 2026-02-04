import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-orange p-1.5 rounded-lg rotate-3">
                            <span className="text-white font-bold text-lg">PP</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-brand-green-dark">
                            The Pickle Point- Cebu<span className="text-brand-orange">.</span>
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="#courts" className="font-medium hover:text-brand-orange transition-colors">Courts</a>
                            <a href="#offers" className="font-medium hover:text-brand-orange transition-colors">Offers</a>
                            <a href="#contact" className="font-medium hover:text-brand-orange transition-colors">Contact</a>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={16} />
                            <span>Mandaue City</span>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-bg-user border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a
                            href="#courts"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                        >
                            Courts
                        </a>
                        <a
                            href="#offers"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                        >
                            Offers
                        </a>
                        <a
                            href="#contact"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                        >
                            Contact
                        </a>
                        <Button
                            onClick={() => {
                                setIsOpen(false);
                                document.getElementById('courts')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full mt-4 text-white"
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}