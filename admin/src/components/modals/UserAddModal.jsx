import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApi } from '../../context/ApiContext';

const UserAddModal = ({ isOpen, onClose, onSave }) => {
    const { addNewUser } = useApi()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')



    const handleSubmit = async (e) => {

        e.preventDefault();
        // return
        try {
            if (!username || !email || !password) {
                alert("all fields are required")
            } else if (!role || role === '') {
                alert("please select a role to continue")
            } else {
                const result = await onSave(username, email, password, role);
                setUsername('')
                setEmail('')
                setPassword('')
                setRole('')
                return result.data;
                // result.log("api response", result)
            }
        } catch (error) {
            console.log("error adding usser", error)

        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center">
            <div className="bg-white rounded-xl md:w-[600px] w-full mx-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-semibold">
                        Add New User
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Super Admin</option>
                            <option value="finance">Finance</option>
                            <option value="store">Store Guy</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-zinc-200 rounded-2xl hover:bg-zinc-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-black text-white rounded-2xl hover:bg-zinc-800"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserAddModal;