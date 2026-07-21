import Listings from '@/components/Listings';
import AppLayout from '@/layout/AppLayout'
import React, { useState } from 'react'

const LIstingsPage = () => {
    const [activeTab, setActiveTab] = useState('Apartment Listings');
    return (
        <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="w-full">
                <Listings />
            </div>
        </AppLayout>
    )
}

export default LIstingsPage