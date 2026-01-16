import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdateUser: (updatedUser: User) => void;
    onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [mobile, setMobile] = useState(user.mobile || '');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        // In a real app, we'd update Firestore here via authService
        // For now, we'll simulate the update propagation
        // TODO: Add updateProfile method to authService if needed for persistence

        // Simulating quick update for UI responsiveness
        setTimeout(() => {
            onUpdateUser({ ...user, name, mobile });
            setIsEditing(false);
            setLoading(false);
        }, 500);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-10 flex flex-col items-center">
                    <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-emerald-500 shadow-2xl mb-6" />

                    {isEditing ? (
                        <div className="w-full space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Full Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold mt-1 focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Mobile</label>
                                <input value={mobile} onChange={e => setMobile(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold mt-1 focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-white">{user.name}</h2>
                            <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">{user.role}</p>
                            <div className="mt-6 space-y-2 bg-slate-800/50 p-6 rounded-2xl w-full">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-bold">Email</span>
                                    <span className="text-white font-medium">{user.email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-bold">Mobile</span>
                                    <span className="text-white font-medium">{user.mobile || 'Not set'}</span>
                                </div>
                                {user.role === 'owner' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold">License</span>
                                        <span className="text-white font-medium">{user.licenseId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 w-full mt-8">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl font-black text-slate-400 bg-slate-800 hover:bg-slate-700">Cancel</button>
                                <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-xl font-black text-slate-900 bg-emerald-500 hover:bg-emerald-400">Save Changes</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="flex-1 py-3 rounded-xl font-black text-slate-900 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20">Edit Profile</button>
                                <button onClick={handleDeleteAccount} disabled={loading} className="flex-1 py-3 rounded-xl font-black text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20">Delete Account</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
