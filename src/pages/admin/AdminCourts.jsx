import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card } from '../../components/ui';
import { courts as initialCourts } from '../../data/courts';

export function AdminCourts() {
    const [courts, setCourts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Outdoor Hard',
        price: 350,
        image: '/images/court1.jpg',
        description: ''
    });

    useEffect(() => {
        loadCourts();
    }, []);

    const loadCourts = () => {
        const stored = localStorage.getItem('courts');
        if (stored) {
            setCourts(JSON.parse(stored));
        } else {
            // Seed with default data if empty
            localStorage.setItem('courts', JSON.stringify(initialCourts));
            setCourts(initialCourts);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        let updatedCourts;

        if (editingCourt) {
            // Update existing
            updatedCourts = courts.map(c => c.id === editingCourt.id ? { ...c, ...formData, price: Number(formData.price) } : c);
        } else {
            // Add new
            const newCourt = {
                id: Date.now(), // simple ID generation
                ...formData,
                price: Number(formData.price),
                status: 'Available'
            };
            updatedCourts = [...courts, newCourt];
        }

        setCourts(updatedCourts);
        localStorage.setItem('courts', JSON.stringify(updatedCourts));
        resetForm();
    };

    const handleDelete = (id) => {
        if (!confirm('Area you sure you want to remove this court?')) return;
        const updatedCourts = courts.filter(c => c.id !== id);
        setCourts(updatedCourts);
        localStorage.setItem('courts', JSON.stringify(updatedCourts));
    };

    const startEdit = (court) => {
        setEditingCourt(court);
        setFormData({
            name: court.name,
            type: court.type,
            price: court.price,
            image: court.image,
            description: court.description
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setIsFormOpen(false);
        setEditingCourt(null);
        setFormData({ name: '', type: 'Outdoor Hard', price: 350, image: '/images/court1.jpg', description: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-brand-green-dark">Court Management</h1>
                    <p className="text-gray-500">Add, edit, or remove playing courts</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus size={18} className="mr-2" /> Add Court
                </Button>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4">{editingCourt ? 'Edit Court' : 'Add New Court'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Court Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
                                    placeholder="e.g. Court 3 (Indoor)"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
                                    >
                                        <option>Outdoor Hard</option>
                                        <option>Indoor Hard</option>
                                        <option>Grass</option>
                                        <option>Clay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱/hr)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" type="button" className="flex-1" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" className="flex-1">{editingCourt ? 'Update Court' : 'Create Court'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court) => (
                    <Card key={court.id} className="overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                    onClick={() => startEdit(court)}
                                    className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(court.id)}
                                    className="p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{court.name}</h3>
                                    <p className="text-sm text-gray-500">{court.type}</p>
                                </div>
                                <span className="font-bold text-brand-orange">₱{court.price}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{court.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
