import { ArrowRight, Calendar, Users } from 'lucide-react';
import { Button } from './ui';

export function Hero() {
    return (
        <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-green-light rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-brand-orange-light rounded-full blur-3xl opacity-50 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-green/20 mb-6 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-brand-green"></span>
                            <span className="text-sm font-medium text-gray-600">New courts available in Mandaue City</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-display font-bold leading-tight text-brand-green-dark mb-6">
                            Book your next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green-dark">Match Point</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                            Experience the best pickleball courts in Cebu. Premium surfaces, night lighting, and a vibrant community waiting for you.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="shadow-brand-green/25 shadow-lg"
                                onClick={() => document.getElementById('courts')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book a Court <ArrowRight size={18} />
                            </Button>
                        </div>

                        <div className="mt-10 flex items-center gap-6 text-gray-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <Users size={18} className="text-brand-orange" />
                                <span>20+ Active Players</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-brand-orange" />
                                <span>Open 7 Days a Week</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/images/court2.jpg"
                                alt="Pickleball Court"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-bold text-xl">Center Court</p>
                                <p className="text-white/80">Premium Surface • Lighting</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
