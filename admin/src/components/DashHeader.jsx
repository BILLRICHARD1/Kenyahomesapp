import { Plus } from 'lucide-react'
import React from 'react'

const DashHeader = ({ title, subtitle, onClickfunction, buttontrue, buttontext }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>
                    <p className="text-zinc-600 mt-1">{subtitle}</p>
                </div>
                {
                    buttontrue && <button
                        onClick={onClickfunction}
                        className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-zinc-800 transition-all"
                    >
                        <Plus size={20} />
                        {buttontext}
                    </button>
                }
            </div>
        </div>
    )
}

export default DashHeader