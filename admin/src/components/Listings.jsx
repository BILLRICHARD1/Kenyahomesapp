import { useEffect, useState } from 'react';
import {
    Plus, Edit2, Trash2, Search, UserCheck,
    Shield, Users as UsersIcon,
    X,
    User,
    StoreIcon,
    BadgeDollarSignIcon,
    Eye
} from 'lucide-react';
import UserEditModal from './modals/UserEditModal';
import { useApi } from '../context/ApiContext';
import UserAddModal from './modals/UserAddModal';
import DashHeader from './DashHeader';

const initialUsers = [
    { id: 1, fullName: "John Doe", email: "john@namelix.com", role: "admin", status: "active" },
    { id: 2, fullName: "Jane Smith", email: "jane@namelix.com", role: "finance", status: "active" },
    { id: 3, fullName: "Peter Kamau", email: "peter@namelix.com", role: "store", status: "active" },
    { id: 4, fullName: "Mary Wanjiku", email: "mary@namelix.com", role: "finance", status: "inactive" },
];

const Listings = () => {
    const { getAllListings } = useApi();
    const [listings, setlistings] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addNewUser, updateUser, deleteUser } = useApi()
    console.log("lis", listings)
    const uploadurl = "http://localhost:5000/uploads/"

    const fetchlistings = async () => {
        try {
            setLoading(true);
            const data = await getAllListings();
            setlistings(data.listings);
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Call when needed (e.g., on button click or component mount)
    useEffect(() => {
        fetchlistings();
    }, []);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setAddShowModal] = useState(false);
    const [showDeleteUserModal, setDeleteUserModal] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [deletinguser, setDeletinguser] = useState(null)

    // call deletion modal
    const callDeleteModal = (user) => {
        setDeleteUserModal(true)
        // setDeletinguser(null)
        setDeletinguser(user)
    }

    const closeDeleteModal = () => {
        setDeleteUserModal(false)
        // setDeletinguser(null)
        setDeletinguser(null)
    }

    const itemsPerPage = 8;

    // Filter listings
    const filteredlistings = listings?.filter(list =>
        list.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        list.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredlistings.length / itemsPerPage);
    const paginatedlistings = filteredlistings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (user = null) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const openAddModal = (user = null) => {
        setAddShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const closeAddModal = () => {
        setAddShowModal(false);
    };

    const handleSaveUser = async ({ username, email, password, role, id }) => {
        try {
            const result = await updateUser(username, email, password, role, id)
            if (result?.success) {
                await fetchlistings();
                closeModal(false);
            }

        } catch (error) {
            console.log("error", error)

        }
    };

    const handleAddUser = async (username, email, password, role) => {
        try {
            const result = await addNewUser(username, email, password, role)
            if (result?.success) {
                await fetchlistings();
                setAddShowModal(false);
            }

        } catch (error) {
            console.log("error", error)

        }
    }

    const userDelete = async (id) => {
        try {
            const result = await deleteUser(id)
            if (result?.success) {
                await fetchlistings();
                closeDeleteModal()
            }

        } catch (error) {
            console.log("user not deleted", error)
        }
    }


    const toggleStatus = (id) => {
        setlistings(listings.map(u =>
            u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        ));
    };

    const [landlord, setLandlord] = useState(null)
    const [lm, setLm] = useState(false)

    const showLandlordModal = (list) => {
        if (list) {
            setLandlord(list)
            setLm(true)
        }
        else {
            setLm(false)
        }
    }

    return (
        <div className="p-6">


            <DashHeader
                title="Listings Management"
                subtitle="Manage system listings"
                onClickfunction={openAddModal}
                buttontrue={true}
                buttontext="Add New User"
            />

            {/* Search & Stats */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-96">
                    <Search className="absolute left-4 top-3 text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                    />
                </div>
                <div className="text-sm text-zinc-500">
                    Showing {paginatedlistings.length} of {filteredlistings.length} listings
                </div>
            </div>

            {/* listings Table */}
            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Image</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Name</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Location</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Price</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Type</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Landlord</th>
                            <th className="text-right py-5 px-6 font-medium text-zinc-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedlistings.map((list) => (
                            <tr key={list.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">

                                        <img src={`${uploadurl}${list?.images[0]}`}

                                            alt="" className="h-12 w-12 object-cover rounded-full" />
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">

                                        <div>
                                            <p className="font-medium">{list.title}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-6 text-zinc-600">{list.location}</td>
                                <td className="py-5 px-6">
                                    {list.price}
                                </td>
                                <td className="py-5 px-6">
                                    {list.type}
                                </td>
                                <td className="py-5 px-6">
                                    <button
                                        onClick={() => showLandlordModal(list)}
                                        className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 hover:text-black transition-all"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openModal(list)}
                                            className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 hover:text-black transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => callDeleteModal(list)}
                                            className="p-2 hover:bg-red-50 rounded-xl text-zinc-600 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className='text-red-500' size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all
                                ${currentPage === page
                                    ? 'bg-black text-white'
                                    : 'bg-white border border-zinc-200 hover:border-black'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* User Modal */}
            <UserEditModal
                isOpen={showModal}
                onClose={closeModal}
                user={editingUser}
                onSave={handleSaveUser}
            />

            <UserAddModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                onSave={handleAddUser}
            />


            {/* delete modal */}
            {
                deletinguser && showDeleteUserModal ? (<div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center">
                    <div className="bg-white rounded-xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-center p-6 border-b">
                            <p className="text-md">Are you sure you want to delete this user?</p>
                            <button onClick={closeDeleteModal} className="text-zinc-400 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-row  py-6 items-center justify-center space-x-5 items-center">
                            <button
                                onClick={closeDeleteModal}
                                className="bg-black p-2 rounded-md w-40 text-white">Cancel</button>
                            <button
                                onClick={() => userDelete(deletinguser?.id)}
                                className="bg-red-500 p-2 rounded-md w-40 text-white">Delete</button>
                        </div>


                    </div>
                </div>) : null
            }

            {
                lm && <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 mx-4">
                        <div className="w-full flex flex-col space-y-4">
                            <p className="text-black">Name: {landlord.landlord.username}</p>
                            <p className="text-black">Phone: {landlord.landlord.email}</p>
                            <p className="text-black">Email: {landlord.landlord.phone}</p>
                        </div>

                        <div className="flex flex-row  py-6 items-center justify-center space-x-5 items-center">
                            <button
                                onClick={() => showLandlordModal()}
                                className="bg-black p-2 rounded-md w-40 text-white">Cancel</button>

                        </div>


                    </div>
                </div>
            }
        </div>
    );
};

export default Listings;