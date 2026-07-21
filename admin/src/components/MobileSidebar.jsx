import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Package, TrendingUp, ShoppingCart,
    FileText, BarChart3, Settings, LogOut, Menu, X, Bell,
    Users2Icon, ReceiptCent,
    ShoppingCartIcon,
    House
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const MobileSidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const role = user?.role;
    const navigate = useNavigate()

    // handle logout
    const handleLogout = () => {
        setLoggingout(false)
        logout();

    };

    // Role-Based Menu Items
    const allMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'finance', 'store'] },
        // { id: 'production', label: 'Production', icon: Package, roles: ['admin', 'store'] },
        { id: 'listings', label: 'Apartments', icon: House, roles: ['admin', ''] },
        // { id: 'finance', label: 'Finance', icon: BarChart3, roles: ['admin', 'finance'] },
        // { id: 'materials', label: 'Raw Materials', icon: ReceiptCent, roles: ['admin', 'store', 'finance'] },
        // { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'finance'] },
        { id: 'users', label: 'Users', icon: Users2Icon, roles: ['admin'] },
        // { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'finance', 'store'] },
    ];

    // Filter menu items based on user role
    const menuItems = allMenuItems.filter(item => item.roles.includes(role));
    const [loggingout, setLoggingout] = useState(false)
    const [showlogoutmodal, setShowlogoutmodal] = useState(false)

    const handleLogoutModal = () => {
        if (!loggingout) {
            setLoggingout(true)
        } else {
            setLoggingout(false)
        }
    }
    return (
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-zinc-200 flex flex-col transition-all duration-300`}>
            {/* Logo */}
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">N</span>
                </div>
                {sidebarOpen && <span className="font-semibold text-2xl tracking-tight">Namelix</span>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(`/${item.id}`)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                            ${activeTab === item.id
                                ? 'bg-black text-white shadow-sm'
                                : 'hover:bg-zinc-100 text-zinc-700'}`}
                    >
                        <item.icon size={20} />
                        {sidebarOpen && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-zinc-100 mt-auto">
                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-2xl">
                    <div className="w-9 h-9 bg-zinc-300 rounded-full flex items-center justify-center">
                        <span className="text-black font-medium">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user?.fullName || user?.username}</p>
                            <p className="text-xs text-zinc-500 capitalize">{role}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogoutModal}
                        className="text-zinc-400 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>



            {/* delete modal */}
            {
                loggingout ? (<div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center">
                    <div className="bg-white rounded-xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-center p-6 border-b">
                            <div className="w-full">
                                <p className="text-lg font-semibold">It is sad to see you leave😭😭😭.</p>
                                <p className="text-md">Are you sure you want to log out?</p>
                            </div>
                            <button onClick={handleLogoutModal} className="text-zinc-400 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-row  py-6 items-center justify-center space-x-5 items-center">
                            <button
                                onClick={handleLogoutModal}
                                className="bg-black p-2 rounded-md w-40 text-white">Stay</button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 p-2 rounded-md w-40 text-white">Logout</button>
                        </div>


                    </div>
                </div>) : null
            }
            <div className="absolute bottom-10 right-10">
                <button onClick={() => setActiveTab('pos')} title='open pos' className="bg-black/70 space-x-3 text-white p-3 rounded-full flex flex-row justify-center items-center h-10">
                    <ShoppingCart className='text-white' size={20} />
                    <p className="text-white">Open POS</p>
                </button>
            </div>
        </div>
    );
};

export default MobileSidebar;