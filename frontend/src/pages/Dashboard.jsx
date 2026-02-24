import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Home, Plus, LogOut, Settings, Bell, CheckCircle, Search } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
                <div className="p-6">
                    <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
                        <span>KostKlabat</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <a href="#" className="flex items-center px-4 py-3 text-gray-900 bg-blue-50 rounded-xl font-medium transition-colors">
                        <LayoutDashboard size={20} className="mr-3 text-blue-600" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Home size={20} className="mr-3" />
                        My Properties
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                        <Settings size={20} className="mr-3" />
                        Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white h-20 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell size={24} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                                {user.name.charAt(0)}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Properties</p>
                            <h3 className="text-3xl font-bold text-gray-900">0</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <p className="text-gray-500 text-sm font-medium mb-1">Total Views</p>
                            <h3 className="text-3xl font-bold text-gray-900">128</h3>
                            <span className="text-green-500 text-xs font-medium flex items-center mt-2">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                +12% this week
                            </span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <p className="text-gray-500 text-sm font-medium mb-1">Messages</p>
                            <h3 className="text-3xl font-bold text-gray-900">4</h3>
                        </div>
                    </div>

                    {/* Empty State */}
                    <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Home size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No properties listed yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Get started by adding your boarding house to our directory. It only takes a few minutes.
                        </p>
                        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform active:scale-95">
                            <Plus size={20} className="mr-2" />
                            Add New Property
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
