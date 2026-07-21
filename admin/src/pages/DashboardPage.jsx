'use client';

import React, { useEffect, useState } from 'react';
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
import { useApi } from '@/context/ApiContext';



const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useAuth()
    const role = user?.role;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { getStats } = useApi()

    const [stats, setStats] = useState([])

    const fetchStats = async () => {
        setLoading(true)
        try {
            setLoading(true);
            const data = await getStats();
            console.log("data", data)
            setStats(data);
            setLoading(false)
        } catch (err) {
            console.error(err.message);
            alert(err.message);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    console.log("stats", stats)

    useEffect(() => {
        fetchStats()
    }, [])



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

    const renderContent = (stats) => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome stats={stats} salesData={salesData} productionData={productionData} user={user} />;
            case 'pos':
                navigate("/users");
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
                    {renderContent(stats)}
                </main>
            </div>
        </div>
    );
};


/* ==================== Original Beautiful Dashboard Home ==================== */
const DashboardHome = ({ salesData, productionData, user, stats }) => {
    const alldashboardstats = [
        { title: "Total users", value: stats?.totalUsers, change: "+8.2%", roles: ['admin', 'store', 'finance'] },
        { title: "Total Users", value: stats?.totalLandlords, change: "", roles: ['admin', 'finance'] },
        { title: "Total Listings", value: stats?.totalListings, change: "+12%", roles: ['admin', 'finance'] },
        { title: "Total Revenue", value: stats?.revenue, change: "+12%", roles: ['admin', 'finance'] },

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




            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-100">
                <h3 className="font-semibold mb-4">Recent Users</h3>
                <div className="space-y-4">
                    {stats?.recentUsers?.map((user, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0">
                            <div className="w-2 h-2 bg-black rounded-full" />
                            <p className="text-sm text-zinc-700">{user?.username}</p>
                            <span className="ml-auto text-xs text-zinc-500">Just now</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;