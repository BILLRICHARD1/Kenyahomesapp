import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Package, TrendingUp, ShoppingCart,
    FileText, BarChart3, Settings, LogOut, Menu, X, Bell,
    Users2Icon, ReceiptCent,
    ShoppingCartIcon,
    Plus,
    House
} from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const AppSidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
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
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} hidden md:flex bg-white border-r border-zinc-200 flex flex-col transition-all duration-300`}>
            {/* Logo */}
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">N</span>
                </div>
                {sidebarOpen && <span className="font-semibold text-2xl tracking-tight">Kenyahouse</span>}
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
                    <Dialog>

                        <DialogTrigger render={
                            <button
                                onClick={handleLogoutModal}
                                className="text-zinc-400 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        } />
                        <DialogContent className="sm:max-w-sm bg-white text-black border-none">
                            <DialogHeader>
                                <DialogTitle className="text-xl">Logout</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to logout?
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <DialogClose render={<Button variant="outline px-3 py-2">Cancel</Button>} />
                                <Button type="submit" className="bg-red-500 text-white px-3 py-2" onClick={handleLogout}>Logout</Button>
                            </DialogFooter>
                        </DialogContent>

                    </Dialog>

                </div>
            </div>






        </div>
    );
};

export default AppSidebar;