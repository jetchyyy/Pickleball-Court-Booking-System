import { Armchair, Car, DoorOpen, Volleyball, Gamepad2, ShowerHead } from 'lucide-react';

export function Offers() {
    return (
        <section id="offers" className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-green-dark mb-4">
                        What This Place Offers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Enjoy premium amenities designed for your comfort and entertainment before and after your game.
                    </p>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <AmenityCard icon={<ShowerHead size={32} />} title="Toilet & Changing Room" />
                    <AmenityCard icon={<Armchair size={32} />} title="Lounge Area" />
                    <AmenityCard icon={<Car size={32} />} title="Parking" />
                    <AmenityCard icon={<Volleyball size={32} />} title="Ping Pong" />
                    <AmenityCard icon={<Gamepad2 size={32} />} title="Billiards" />
                </div>
            </div>
        </section>
    );
}

function AmenityCard({ icon, title }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow duration-300 group">
            <div className="w-16 h-16 rounded-full bg-brand-green-light text-brand-green-dark flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <span className="font-medium text-gray-700">{title}</span>
        </div>
    );
}
