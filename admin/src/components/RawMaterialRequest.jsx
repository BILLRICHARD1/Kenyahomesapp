import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import DashHeader from './DashHeader'
import MaterialRequestModal from './modals/MaterialRequestModal'

const RawMaterialRequest = () => {
    const [isopen, setIsopen] = useState(false)
    const openModal = () => {
        if (isopen) {
            setIsopen(false)
        }
        else {
            setIsopen(true)
        }
    }

    return (
        <div className="p-6">
            <div className="w-full">
                <DashHeader
                    title="Raw Material Management"
                    subtitle="Request and manage raw materials"
                    onClickfunction={openModal}
                    buttontrue={true}
                    buttontext="Request Materials"
                />
                <MaterialRequestModal
                    isOpen={isopen}
                    onClose={openModal}
                />
            </div>
        </div>
    )
}

export default RawMaterialRequest