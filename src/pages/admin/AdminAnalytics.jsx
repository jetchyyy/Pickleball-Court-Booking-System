import { BarChart3, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '../../components/ui';

export function AdminAnalytics() {
    const [revenueData, setRevenueData] = useState([]);
    const [utilizationData, setUtilizationData] = useState([]);

    useEffect(() => {
        // Mocking chart data based on localStorage or generating random realistic data 
        // In a real app, this would aggregate actual booking data

        // Mock Weekly Revenue
        setRevenueData([
            { day: 'Mon', value: 2400, height: '40%' },
            { day: 'Tue', value: 1800, height: '30%' },
            { day: 'Wed', value: 3200, height: '55%' },
            { day: 'Thu', value: 2800, height: '45%' },
            { day: 'Fri', value: 4500, height: '75%' },
            { day: 'Sat', value: 5800, height: '95%' },
            { day: 'Sun', value: 5200, height: '85%' },
        ]);

        // Mock Court Utilization
        setUtilizationData([
            { name: 'Court 1 (Outdoor)', value: 78 },
            { name: 'Court 2 (Outdoor)', value: 65 },
            { name: 'Center Court', value: 92 },
        ]);
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-display text-brand-green-dark">Analytics & Reports</h1>
                <p className="text-gray-500">Performance metrics and utilization reports</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Weekly Revenue</h3>
                            <p className="text-sm text-gray-500">Last 7 Days</p>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                            <TrendingUp size={16} className="mr-1" /> +15.3%
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2">
                        {revenueData.map((item) => (
                            <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className="w-full max-w-[40px] bg-brand-green rounded-t-lg transition-all duration-500 hover:bg-brand-green-dark"
                                        style={{ height: item.height }}
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                        ₱{item.value}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Court Utilization */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Court Utilization</h3>
                            <p className="text-sm text-gray-500">Occupancy rates per court</p>
                        </div>
                        <div className="p-2 bg-brand-orange-light text-brand-orange rounded-lg">
                            <BarChart3 size={20} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {utilizationData.map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="font-bold text-gray-900">{item.value}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-orange rounded-full transition-all duration-1000"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            <strong>Note:</strong> Kago Shinji is the best developer in the world.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Generated Reports Table Mockup */}
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Generated Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Report Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date Range</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Generated On</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">Monthly Sales Report</td>
                                    <td className="px-6 py-4 text-gray-500">Jan 1 - Jan 31, 2026</td>
                                    <td className="px-6 py-4 text-gray-500">Jan 31, 2026</td>
                                    <td className="px-6 py-4">
                                        <button className="text-brand-green-dark hover:underline text-sm font-medium">Download PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
