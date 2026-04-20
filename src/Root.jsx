import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ViewerApp from './viewer.jsx';
// import UserApp from './user.jsx';
// import CasterApp from './caster.jsx';
// import StreamerApp from './streamer.jsx';
// import OrganizerApp from './organizer.jsx';
// import AdminApp from './admin.jsx';

//Real Deal
import RealDealApp from './viewer/viewer_realdeal.jsx';


const Home = () => (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-black mb-12 text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
            Select Your Experience
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
            <Link to="/viewer" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-indigo-500/50">
                        V
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Viewer App</h2>
                    <p className="text-gray-400 text-sm">Watch streams, check brackets, and follow your favorite teams.</p>
                </div>
            </Link>

            {/* <Link to="/user" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        U
                    </div>
                    <h2 className="text-2xl font-bold mb-2">User App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link>

            <Link to="/caster" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        C
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Caster App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link>

            <Link to="/streamer" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        S
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Streamer App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link>
            <Link to="/organizer" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        O
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Organizer App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link>
            <Link to="/admin" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        A
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Admin App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link> */}
            {/* Real Deal */}
            <Link to="/viewer_realdeal" className="group relative w-64 h-80 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-purple-500/50">
                        R
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Real Deal App</h2>
                    <p className="text-gray-400 text-sm">Landing page, features, talent showcase, and documentation.</p>
                </div>
            </Link>
        </div>
    </div>
);

export default function Root() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/viewer" element={<ViewerApp />} />
                {/* <Route path="/user" element={<UserApp />} />
                <Route path="/caster" element={<CasterApp />} />
                <Route path="/streamer" element={<StreamerApp />} />
                <Route path="/admin" element={<AdminApp />} />
                <Route path="/organizer" element={<OrganizerApp />} /> */}
                <Route path="/viewer_realdeal" element={<RealDealApp />} />
            </Routes>
        </BrowserRouter>
    );
}
