import { Menu, X, Bell } from 'lucide-react'
import React from 'react'


const Navbar = ({ sidebarOpen, setSidebarOpen, activeTab }) => {
    return (
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
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="text-sm">
                    <p className="font-medium">May 20, 2026</p>
                    <p className="text-xs text-zinc-500">Nyeri, Kenya</p>
                </div>
            </div>


        </header>
    )
}

export default Navbar