import React, { useState } from 'react';
import FormInput from './FormInput';
import LoadingSpinner from './LoadingSpinner';
import { showToast } from './Toast';
import { TOAST_TYPES, API_ENDPOINTS } from '../utils/constants';
import { useApi } from '../hooks/useApi';

export default function JoinPackageModal({ onClose, onJoined }) {
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { get } = useApi();

    const handleJoin = async () => {
        if (!link.trim()) {
            setError('Please enter a package link or ID');
            return;
        }

        let packageId = link.trim();
        const maybe = packageId.match(/([a-f0-9]{24})$/i);
        if (maybe) packageId = maybe[1];

        setError('');
        setLoading(true);

        try {
            // Try backend first
            try {
                const pkg = await get(API_ENDPOINTS.PACKAGE(packageId), { showErrorToast: false });
                // If package is paid, inform user (purchase flow not implemented here)
                const price = pkg.discountedPrice ?? pkg.totalPrice ?? pkg.price ?? 0;
                if (price > 0) {
                    showToast(TOAST_TYPES.INFO, 'This package is paid. Purchase flow not implemented in this modal.');
                    setLoading(false);
                    return;
                }

                // Register locally for package (simple local enroll)
                let userId = null;
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        userId = payload.id;
                    }
                } catch (e) {
                    // ignore
                }

                if (!userId) {
                    showToast(TOAST_TYPES.ERROR, 'Please login to join packages');
                    setLoading(false);
                    return;
                }

                const regsKey = `packageRegs_${userId}`;
                const existing = JSON.parse(localStorage.getItem(regsKey) || '[]');
                if (!existing.includes(pkg._id)) {
                    existing.push(pkg._id);
                    localStorage.setItem(regsKey, JSON.stringify(existing));
                }

                showToast(TOAST_TYPES.SUCCESS, `Joined package: ${pkg.title}`);
                if (onJoined) onJoined();
                onClose();
                return;
            } catch (apiErr) {
                // fallback to localStorage search similar to webinars
            }

            // Fallback: search localStorage for created packages
            let found = null;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;
                if (key.startsWith('userPackages_')) {
                    try {
                        const arr = JSON.parse(localStorage.getItem(key) || '[]');
                        const p = (arr || []).find(x => x._id === packageId);
                        if (p) { found = p; break; }
                    } catch (e) {
                        // ignore
                    }
                }
            }

            if (!found) {
                setError('Package not found. Please check the link or ID.');
                setLoading(false);
                return;
            }

            let userId = null;
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    userId = payload.id;
                }
            } catch (e) { }

            if (!userId) {
                showToast(TOAST_TYPES.ERROR, 'Please login to join packages');
                setLoading(false);
                return;
            }

            const regsKey = `packageRegs_${userId}`;
            const existing = JSON.parse(localStorage.getItem(regsKey) || '[]');
            if (!existing.includes(found._id)) {
                existing.push(found._id);
                localStorage.setItem(regsKey, JSON.stringify(existing));
            }

            showToast(TOAST_TYPES.SUCCESS, `Joined package: ${found.title}`);
            if (onJoined) onJoined();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Join Package</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition">×</button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Paste the package link or package ID.</p>
                    <FormInput label="Package Link or ID" value={link} onChange={(e) => { setLink(e.target.value); setError(''); }} placeholder="https://.../packages/preview/<id> or <packageId>" error={error} />

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Cancel</button>
                        <button onClick={handleJoin} disabled={loading || !link.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (<><LoadingSpinner size="sm" /><span>Joining...</span></>) : 'Join Package'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
