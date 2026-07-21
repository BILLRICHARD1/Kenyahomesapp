'use client';

import React, { useState } from 'react';
import {
    User, Shield, Bell, Palette, Building2
} from 'lucide-react';
import DashHeader from './DashHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useApi } from '@/context/ApiContext';

const UserSettings = ({ user }) => {
    const [currentpassword, setCurrentpassword] = useState('')
    const [newpassword, setNewpassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const { resetPassword } = useApi();

    const handlePasswordreset = async (e) => {
        e.preventDefault();
        if (newpassword !== confirmpassword) {
            toast.error("Passwords do not match", { position: "top-right" });
            return;
        }
        else {
            try {
                const result = await resetPassword(currentpassword, newpassword, user?.id);
                if (result?.success) {
                    toast.success("Password reset successful", { position: "top-right" });
                    setCurrentpassword('');
                    setNewpassword('');
                    setConfirmpassword('');
                } else {
                    toast.error(result?.error?.message || "Error resetting password", { position: "top-right" });
                }
            } catch (error) {
                toast.error("Error resetting password", { position: "top-right" });
                console.log("error resetting password", error)
            }
        }
    }
    return (
        <div className="p-6 w-full">
            <DashHeader
                title="Settings"
                subtitle="Manage your account and system preferences"
            />

            <div className="mt-10 w-full flex flex-col">
                <Tabs defaultValue="profile" className="w-full flex flex-col">
                    {/* Tabs Header */}
                    <TabsList className="grid w-full grid-cols-5 bg-zinc-100 p-1.5 rounded-3xl">
                        <TabsTrigger
                            value="profile"
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                        >
                            <Shield className="mr-2 h-4 w-4" />
                            Security
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                        >
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                        >
                            <Palette className="mr-2 h-4 w-4" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger
                            value="system"
                            className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                        >
                            <Building2 className="mr-2 h-4 w-4" />
                            System
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Contents - Full Width & Clean */}
                    <div className="mt-8 flex flex-col w-full">
                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <div className="bg-white rounded-3xl p-8 border border-zinc-100">
                                <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 block mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.fullName || user?.username || "John Doe"}
                                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 block mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || "john@namelix.com"}
                                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 block mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue={user?.phone || "+254 712 345 678"}
                                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-zinc-700 block mb-2">Role</label>
                                        <input
                                            type="text"
                                            disabled
                                            defaultValue={user?.role || "non"}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl"
                                        />
                                    </div>
                                </div>
                                <button className="mt-8 bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-zinc-800 transition-all font-medium">
                                    Save Profile Changes
                                </button>
                            </div>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <div className="bg-white rounded-3xl p-8 border border-zinc-100 space-y-10">
                                <div>
                                    <h3 className="font-semibold text-lg mb-5">Change Password</h3>
                                    <form onSubmit={handlePasswordreset} className="space-y-5">
                                        <input
                                            value={currentpassword}
                                            onChange={(e) => setCurrentpassword(e.target.value)}
                                            type="password" placeholder="Current Password" className="w-full px-4 py-3 border border-zinc-200 rounded-2xl" />
                                        <input
                                            value={newpassword}
                                            onChange={(e) => setNewpassword(e.target.value)}
                                            type="password" placeholder="New Password" className="w-full px-4 py-3 border border-zinc-200 rounded-2xl" />
                                        <input
                                            value={confirmpassword}
                                            onChange={(e) => setConfirmpassword(e.target.value)}
                                            type="password" placeholder="Confirm New Password" className="w-full px-4 py-3 border border-zinc-200 rounded-2xl" />
                                        <button type="submit" className="mt-6 bg-black text-white px-6 py-3 rounded-2xl">Update Password</button>
                                    </form>
                                </div>

                                <div className="pt-8 border-t">
                                    <h3 className="font-semibold text-lg mb-3">Two-Factor Authentication</h3>
                                    <p className="text-zinc-600 mb-5">Add an extra layer of security to your account.</p>
                                    <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition-all">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications">
                            <div className="bg-white rounded-3xl p-8 border border-zinc-100">
                                <h3 className="font-semibold text-lg mb-6">Notification Preferences</h3>
                                {[
                                    "Low stock alerts",
                                    "New production batch completed",
                                    "Daily sales summary",
                                    "Raw material request approved",
                                    "New user registration"
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-5 border-b last:border-0">
                                        <span className="text-zinc-700">{item}</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-black cursor-pointer" />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>


                        {/* System Tab */}
                        <TabsContent value="system">
                            <div className="bg-white rounded-3xl p-8 border border-zinc-100">
                                <h3 className="font-semibold text-lg mb-6">System Configuration</h3>
                                <div className="max-w-md space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Default Price per Sack (KES)</label>
                                        <input type="number" defaultValue="4000" className="w-full px-4 py-3 border border-zinc-200 rounded-2xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Low Stock Alert Threshold (kg)</label>
                                        <input type="number" defaultValue="500" className="w-full px-4 py-3 border border-zinc-200 rounded-2xl" />
                                    </div>
                                    <button className="bg-black text-white px-8 py-3.5 rounded-2xl hover:bg-zinc-800">
                                        Save System Settings
                                    </button>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default UserSettings;