import { BarChart3, Calendar, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        navigate('/admin');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
        { path: '/admin/courts', label: 'Court Management', icon: Settings },
        { path: '/admin/calendar', label: 'Calendar View', icon: Calendar },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-bg-light font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 bottom-0 left-0 z-40 hidden md:flex flex-col">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-100">
                    <div className="bg-brand-orange p-1.5 rounded-lg">
                        <span className="text-white font-bold text-sm">PP</span>
                    </div>
                    <span className="font-display font-bold text-lg text-brand-green-dark">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-brand-green-light text-brand-green-dark'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                            `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut size={18} className="mr-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (visible on small screens) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-brand-orange p-1.5 rounded-lg">
                        <span className="text-white font-bold text-sm">PP</span>
                    </div>
                    <span className="font-display font-bold text-lg text-brand-green-dark">Admin Panel</span>
                </div>
                {/* Mobile menu toggle could go here */}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-8 pt-20 md:pt-8">
                <Outlet />
            </main>
        </div>
    );
}
