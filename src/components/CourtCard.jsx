import { MapPin, Users } from 'lucide-react';
import { Badge, Button, Card } from './ui';

export function CourtCard({ court, onBook }) {
    return (
        <Card className="group h-full flex flex-col">
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={(court.images && court.images[0]?.url) || court.image || '/images/court1.jpg'}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/images/court1.jpg'; }}
                />
                <div className="absolute top-4 right-4">
                    <Badge variant={court.status === 'Available' ? 'green' : 'gray'}>
                        {court.status}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-display font-bold text-lg text-brand-green-dark">{court.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin size={14} />
                            <span>{court.type} Surface</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-brand-orange text-lg">₱{court.price}</span>
                        <span className="text-xs text-gray-400">/ hour</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{court.description}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Users size={14} className="text-brand-green" />
                        Up to 10 players
                    </div>
                    <Button variant="primary" size="sm" onClick={() => onBook(court)}>Book Now</Button>
                </div>
            </div>
        </Card>
    );
}
