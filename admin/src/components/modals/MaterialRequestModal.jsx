import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useAuth } from '../../context/AuthContext';

const MaterialRequestModal = ({ isOpen, onClose }) => {
    const { user } = useAuth()
    const { requestMaterials } = useApi()
    const [requestedby, setRequestedby] = useState(user?.username)
    const [items, setItems] = useState([])
    const [description, setDescription] = useState('')




    const handleSubmit = async (e) => {

        e.preventDefault();
        // return
        try {
            const response = await requestMaterials(
                requestedby,
                items,
                description
            )
            if (response.success) {
                onClose()
            }
            console.log("request submitted")

        } catch (error) {
            console.log("request submit error", error)

        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center">
            <div className="bg-white rounded-xl md:w-[600px] w-full mx-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-semibold">
                        Add New Request
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Requested By</label>
                        <input
                            type="text"
                            disabled
                            value={requestedby}
                            onChange={(e) => setRequestedby(e.target.value)}
                            className="w-full px-4  text-neutral-500 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Items</label>
                        <textarea
                            rows={10}
                            required
                            placeholder='i.e wire:2 strands,metal:3kg'
                            value={items}
                            onChange={(e) => setItems(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">SHort Description(optional)</label>
                        <textarea
                            rows={4}
                            required
                            placeholder='i.e I need those items urgently'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                        />
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
                            Create Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialRequestModal;