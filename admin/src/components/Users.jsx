import { useEffect, useState } from 'react';
import {
    Plus, Edit2, Trash2, Search, UserCheck,
    Shield, Users as UsersIcon,
    X,
    User,
    StoreIcon,
    BadgeDollarSignIcon,
    HomeIcon
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

const Users = () => {
    const { getAllUsers, } = useApi();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addNewUser, updateUser, deleteUser } = useApi()

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data.users);
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Call when needed (e.g., on button click or component mount)
    useEffect(() => {
        fetchUsers();
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

    // Filter users
    const filteredUsers = users?.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
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
                await fetchUsers();
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
                await fetchUsers();
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
                await fetchUsers();
                closeDeleteModal()
            }

        } catch (error) {
            console.log("user not deleted", error)
        }
    }


    const toggleStatus = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        ));
    };

    return (
        <div className="p-6">


            <DashHeader
                title="User Management"
                subtitle="Manage system users and their roles"
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
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-black"
                    />
                </div>
                <div className="text-sm text-zinc-500">
                    Showing {paginatedUsers.length} of {filteredUsers.length} users
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">User</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Email</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Role</th>
                            <th className="text-left py-5 px-6 font-medium text-zinc-500">Status</th>
                            <th className="text-right py-5 px-6 font-medium text-zinc-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-zinc-200 rounded-full flex items-center justify-center">
                                            <UsersIcon size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-6 text-zinc-600">{user.email}</td>
                                <td className="py-5 px-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm
                                        ${user.role === 'admin' ? 'bg-black text-white' :
                                            user.role === 'landlord' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'}`}>
                                        {user.role === 'admin' && <Shield size={16} />}
                                        {user.role === 'landlord' && <HomeIcon size={16} />}
                                        {user.role === 'finance' && <BadgeDollarSignIcon size={16} />}
                                        {user.role.charAt(0)?.toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td className="py-5 px-6">
                                    <button
                                        onClick={() => toggleStatus(user.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                                            ${user.isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'}`}
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-600 hover:text-black transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => callDeleteModal(user)}
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
        </div>
    );
};

export default Users;