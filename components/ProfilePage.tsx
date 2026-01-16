import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface ProfilePageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    onLogout: () => void;
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onLogout, onBack }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [mobile, setMobile] = useState(user.mobile || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            onUpdateUser({ ...user, name, mobile });
            setIsEditing(false);
            setLoading(false);
        }, 800);
    };

    const handleDeleteAccount = async () => {
        if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            setLoading(true);
            try {
                await authService.deleteAccount(user.id);
                onLogout();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete account. You may need to re-login.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-12">
                <button onClick={onBack} className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">My Profile</h1>
                    <p className="text-slate-400 font-medium">Manage your account settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Profile Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            <div className="shrink-0 relative group">
                                <img src={user.avatar} className="w-40 h-40 rounded-[2rem] shadow-2xl border-4 border-slate-800 group-hover:border-emerald-500 transition-colors" />
                                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-slate-900 p-2 rounded-xl shadow-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white">{user.name}</h2>
                                        <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                            {user.role === 'player' ? 'Pro Athlete' : 'Venue Manager'}
                                        </span>
                                    </div>
                                    {!isEditing && (
                                        <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-colors">
                                            Edit Details
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Full Name</label>
                                                <input
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Mobile Number</label>
                                                <input
                                                    value={mobile}
                                                    onChange={e => setMobile(e.target.value)}
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={handleSave} disabled={loading} className="bg-emerald-500 text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="text-slate-400 font-bold px-6 py-4 hover:text-white transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Contact Email</p>
                                            <p className="text-lg font-medium text-white">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Phone</p>
                                            <p className="text-lg font-medium text-white">{user.mobile || 'Not provided'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Badges / Stats Section Mockup */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-[2rem] text-center hover:bg-slate-800/40 transition-colors">
                            <p className="text-3xl font-black text-white mb-1">0</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Games Played</p>
                        </div>
                        <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-[2rem] text-center hover:bg-slate-800/40 transition-colors">
                            <p className="text-3xl font-black text-white mb-1">0</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Bookings</p>
                        </div>
                        <div className="bg-slate-800/20 border border-slate-800 p-6 rounded-[2rem] text-center hover:bg-slate-800/40 transition-colors hidden md:block">
                            <p className="text-3xl font-black text-amber-500 mb-1">Pro</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Member Status</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                        <h3 className="text-xl font-bold text-white mb-6">Account Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full p-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center gap-3 hover:bg-slate-700 transition-colors text-left">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Change Password
                            </button>
                            <button className="w-full p-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center gap-3 hover:bg-slate-700 transition-colors text-left">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                Notifications
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to logout?')) {
                                        onLogout();
                                    }
                                }}
                                className="w-full p-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Log Out
                            </button>
                        </div>

                        <div className="h-px bg-slate-800 my-6"></div>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full p-4 rounded-xl border-2 border-red-500/20 text-red-500 font-black text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete Account
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white mb-2">Support</h3>
                            <p className="text-indigo-200 text-sm mb-6">Need help with your account or bookings?</p>
                            <button className="w-full py-4 bg-white text-indigo-950 font-black rounded-xl hover:bg-indigo-50 transition-colors">Contact Us</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
