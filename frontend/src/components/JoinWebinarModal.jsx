import React, { useState } from 'react';
import FormInput from './FormInput';
import LoadingSpinner from './LoadingSpinner';
import { showToast } from './Toast';
import { TOAST_TYPES } from '../utils/constants';

export default function JoinWebinarModal({ onClose, onJoined }) {
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!link.trim()) {
            setError('Please enter a webinar link or ID');
            return;
        }

        // Extract last path segment from URL or accept plain IDs (supports numeric timestamps too)
        let webinarId = link.trim();
        // remove trailing slash
        webinarId = webinarId.replace(/\/$/, '');
        // get last path segment (handles urls like /webinars/preview/1768921384280)
        const seg = webinarId.match(/([^\/]+)(?=[\/?#]*$)/);
        if (seg && seg[1]) webinarId = seg[1];
        // strip common query/hash if present
        webinarId = webinarId.split(/[?#]/)[0];

        setError('');
        setLoading(true);

        try {
            // Try to find webinar in localStorage (created by CreateWebinar local flow)
            let found = null;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;
                if (key.startsWith('userWebinars_')) {
                    try {
                        const arr = JSON.parse(localStorage.getItem(key) || '[]');
                        const w = (arr || []).find(x => x._id === webinarId);
                        if (w) { found = w; break; }
                    } catch (e) {
                        // ignore parse errors
                    }
                }
            }

            if (!found) {
                setError('Webinar not found. Please check the link or ID.');
                setLoading(false);
                return;
            }

            // Register the current user for the webinar locally
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
                showToast(TOAST_TYPES.ERROR, 'Please login to register for webinars');
                setLoading(false);
                return;
            }

            const regsKey = `webinarRegs_${userId}`;
            const existing = JSON.parse(localStorage.getItem(regsKey) || '[]');
            if (!existing.includes(found._id)) {
                existing.push(found._id);
                localStorage.setItem(regsKey, JSON.stringify(existing));
            }

            showToast(TOAST_TYPES.SUCCESS, `Registered for webinar: ${found.title}`);
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
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Join Webinar</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition">×</button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Paste the webinar link or webinar ID.</p>
                    <FormInput label="Webinar Link or ID" value={link} onChange={(e) => { setLink(e.target.value); setError(''); }} placeholder="https://.../webinars/<id> or <webinarId>" error={error} />

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Cancel</button>
                        <button onClick={handleJoin} disabled={loading || !link.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (<><LoadingSpinner size="sm" /><span>Registering...</span></>) : 'Join Webinar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
