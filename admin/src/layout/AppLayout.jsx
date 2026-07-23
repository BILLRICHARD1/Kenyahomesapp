'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard, Package, TrendingUp, ShoppingCart,
    FileText, BarChart3, Settings, LogOut, Menu, X, Bell,
    Users2Icon,
    ReceiptCent
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import POS from '../components/POS';
import Users from '../components/Users';
import AppSidebar from '../components/Sidebar';
import Products from '../components/Products';
import RawMaterialRequest from '../components/RawMaterialRequest';
import { useAuth } from '../context/AuthContext';
import MobileSidebar from '../components/MobileSidebar';
import UserSettings from '../components/Settings';
import { useNavigate } from 'react-router-dom';



const AppLayout = ({ children, activeTab, setActiveTab }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { user } = useAuth()
    const role = user?.role;
    const navigate = useNavigate()



    const salesData = [
        { month: 'Jan', sales: 124000 }, { month: 'Feb', sales: 98000 },
        { month: 'Mar', sales: 145000 }, { month: 'Apr', sales: 132000 },
        { month: 'May', sales: 178000 }, { month: 'Jun', sales: 148000 },
        { month: 'Jul', sales: 148000 }, { month: 'Aug', sales: 148000 },
        { month: 'Sep', sales: 128000 }, { month: 'Oct', sales: 148000 },
        { month: 'Nov', sales: 148000 }, { month: 'Dec', sales: 148000 },
    ];

    const productionData = [
        { name: '1"', produced: 450, sold: 380 },
        { name: '1.5"', produced: 320, sold: 290 },
        { name: '2"', produced: 280, sold: 250 },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome salesData={salesData} productionData={productionData} user={user} />;
            case 'listings':
                navigate("/listings");
                return null;
            case 'users':
                return <Users />;
            case 'inventory':
                return <Products />;
            case 'materials':
                return <RawMaterialRequest />;
            case 'settings':
                return <UserSettings user={user} />
            default:
                return (
                    <div className="h-full flex items-center justify-center bg-white">
                        <div className="text-center">
                            <h2 className="text-3xl font-semibold mb-2 capitalize">{activeTab}</h2>
                            <p className="text-zinc-500">Module under development</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <AppSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className="md:hidden block">
                <MobileSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-zinc-100 rounded-xl"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="text-2xl font-semibold text-zinc-900 capitalize">
                            {activeTab === 'dashboard' ? 'Dashboard' : activeTab}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-zinc-100 rounded-xl relative">
                            <Bell size={22} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};


/* ==================== Original Beautiful Dashboard Home ==================== */
const DashboardHome = ({ salesData, productionData, user }) => {
    const alldashboardstats = [
        { title: "Total Stock (kg)", value: "14,250", change: "+8.2%", roles: ['admin', 'store', 'finance'] },
        { title: "Total Users", value: "14", change: "", roles: ['admin', 'finance'] },
        { title: "Today's Sales", value: "KSh 248,000", change: "+12%", roles: ['admin', 'finance'] },
        { title: "Expected Revenue", value: "KSh 300,000", change: "+12%", roles: ['admin', 'finance'] },
        { title: "Sacks Available", value: 14250 / 25, change: "+12%", roles: ['admin', 'finance', 'store'] },
        { title: "Production This Month", value: "1,240 Sacks", change: "-3%", roles: ['admin', 'finance', 'store'] },
        { title: "All Pending Requests", value: "7", change: "2 urgent", roles: ['finance', 'admin'] },
        { title: "My Pending Requests", value: "3", change: "3 urgent", roles: ['store'] },
    ]
    const dashboardstats = alldashboardstats.filter(item => item.roles.includes(user?.role))

    return (
        <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'store' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} lg:grid-cols-4 gap-6`}>
                {dashboardstats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                        <p className="text-zinc-500 text-sm">{stat.title}</p>
                        <p className="text-4xl font-semibold mt-2">{stat.value}</p>
                        <p className="text-emerald-600 text-sm mt-2 font-medium">{stat.change}</p>
                    </div>
                ))}
            </div>


            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                    <h3 className="font-semibold mb-6">Sales Trend (Last 5 Months)</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="natural" dataKey="sales" stroke="#000000" strokeWidth={3} dot={{ fill: '#000', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Production vs Sales */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100">
                    <h3 className="font-semibold mb-6">Production vs Sales</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={productionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="produced" fill="#000000" radius={8} />
                            <Bar dataKey="sold" fill="#525252" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-100">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[
                        "25kg of 1\" nails produced - Store Guy",
                        "Custom 15kg sale completed - Finance",
                        "Raw material request approved",
                        "KSh 48,000 received via M-Pesa",
                        "4 inch nails stock updated"
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                            <div className="w-2 h-2 bg-black rounded-full" />
                            <p className="text-sm text-zinc-700">{activity}</p>
                            <span className="ml-auto text-xs text-zinc-500">Just now</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;