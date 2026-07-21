import React from 'react';

const LoadingPage = () => {
    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                {/* Logo / Brand */}
                <div className="mb-10">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-black/50">
                        <span className="text-6xl font-bold text-black">N</span>
                    </div>
                </div>

                {/* Loading Animation */}
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-zinc-700 border-t-white rounded-full animate-spin mb-8" />

                    <h2 className="text-white text-2xl font-semibold tracking-tight mb-2">
                        Loading Kenyahouse
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xs">
                        Preparing your dashboard...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-80 mt-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-white rounded-full animate-[loading_1.5s_infinite_linear]" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-12 w-96 h-96 border border-white/10 rounded-full" />
                <div className="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-full" />
            </div>
        </div>
    );
};

export default LoadingPage;