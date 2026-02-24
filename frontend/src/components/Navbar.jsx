import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getDashboardLink = () => {
        return user.role === 'admin' ? '/admin/dashboard' : '/owner/dashboard';
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <FileText className="text-blue-600" size={28} strokeWidth={2.5} />
                    <span className="text-2xl font-bold text-blue-600 tracking-tight">U-Kost</span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors text-sm hidden md:block"
                    >
                        Beranda
                    </Link>

                    {token ? (
                        <>
                            <Link
                                to={getDashboardLink()}
                                className="px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-shadow shadow-md text-sm flex items-center"
                            >
                                <LayoutDashboard size={16} className="mr-2" />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2 rounded-full bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm"
                        >
                            Masuk / Daftar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
