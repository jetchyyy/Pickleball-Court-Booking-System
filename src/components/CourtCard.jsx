import { MapPin, Users, DollarSign } from 'lucide-react';
import { Badge, Button, Card } from './ui';

export function CourtCard({ court, onBook }) {
    // Format hour to 12-hour format
    const formatHour12 = (hour) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        return `${displayHour.toString().padStart(2, '0')}:00 ${period}`;
    };

    // Check if court has dynamic pricing rules
    const hasPricingRules = court.pricing_rules && court.pricing_rules.length > 0;
    
    // Get max players (default to 10 if not set)
    const maxPlayers = court.max_players || 10;

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

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{court.description}</p>

                {/* Dynamic Pricing Rules Badge */}
                {hasPricingRules && (
                    <div className="mb-3 p-2.5 bg-brand-orange/10 border border-brand-orange/30 rounded-lg">
                        <div className="flex items-start gap-2">
                            <DollarSign size={14} className="text-brand-orange mt-0.5 flex-shrink-0" />
                            <div className="text-xs space-y-1.5 flex-1">
                                <p className="font-semibold text-brand-orange">Time-Based Pricing</p>
                                {court.pricing_rules.map((rule, idx) => (
                                    <p key={idx} className="text-gray-700">
                                        {formatHour12(rule.startHour)} - {formatHour12(rule.endHour)}: <span className="font-bold text-brand-orange">₱{rule.price}/hr</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <Users size={14} className="text-brand-green" />
                        Up to {maxPlayers} player{maxPlayers !== 1 ? 's' : ''}
                    </div>
                    <Button variant="primary" size="sm" onClick={() => onBook(court)}>Book Now</Button>
                </div>
            </div>
        </Card>
    );
}