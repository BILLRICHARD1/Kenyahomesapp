import Users from '@/components/Users'
import AppLayout from '@/layout/AppLayout'
import React, { useState } from 'react'

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    return (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="w-full">
                <Users />

            </div>
        </AppLayout>
    )
}

export default UsersPage