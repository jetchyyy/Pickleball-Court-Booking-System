import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock authentication
        if (email === 'admin@pickle.com' && password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            alert('Invalid credentials!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-display font-bold text-brand-green-dark">Admin Login</h1>
                    <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <Button className="w-full" size="lg">Sign In</Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Demo Credentials:</p>
                    <p>admin@pickle.com / admin123</p>
                </div>
            </div>
        </div>
    );
}
