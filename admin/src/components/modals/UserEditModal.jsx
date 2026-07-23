import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApi } from '../../context/ApiContext';

const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
    const { addNewUser } = useApi()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else {
            setFormData({ username: 'test', email: 'test@gmail.com', role: 'store' });
        }
    }, [user]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         if (!user || users?.length === 0) {
    //             // Create new user
    //             const response = await updateUser({ username: formData.username, email: formData.email, role: formData.role });
    //             console.log("add user response", response);
    //         } else {
    //             // Update user
    //             onSave(formData);
    //         }
    //     } catch (error) {

    //     }
    // };

    const handleSubmit = async (e) => {

        e.preventDefault();
        // return
        try {
            if (!formData.username || !formData.email) {
                alert("all fields are required")
            } else if (!formData.role || formData.role === '') {
                alert("please select a role to continue")
            } else {
                const result = await onSave({ username: formData.username, email: formData.email, password: formData.password, role: formData.role, id: user?.id });
                return result
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
                        {`Edit User`}
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
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        >
                            <option value="admin">Admin</option>
                            <option value="landlord">Landlord</option>
                            <option value="user">User</option>
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
                            {user ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;