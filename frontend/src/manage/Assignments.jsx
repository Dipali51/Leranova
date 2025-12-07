import React, { useEffect, useState, useRef, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function AssignmentsManage() {
	const [assets, setAssets] = useState([]);
	const [loading, setLoading] = useState(true);
	const fileRef = useRef(null);
	const apiBase = '/api';

	// Build a full URL for uploaded files. If dev proxy is used (/api -> backend), a simple relative path may work.
	// Fallback to explicit backend host when running frontend on a different port during development.
	const getFileUrl = (filePath) => {
		if (!filePath) return filePath;
		// If already absolute, return as-is
		if (/^https?:\/\//i.test(filePath)) return filePath;
		// If running under the same origin and a dev proxy is configured, the relative path will resolve.
		// Try relative first
		try {
			const url = new URL(filePath, window.location.origin);
			return url.toString();
		} catch (e) {
			// Fallback to localhost:3001 which is the backend default in this workspace
			return `http://localhost:3001${filePath.startsWith('/') ? '' : '/'}${filePath}`;
		}
	};

	// State for custom messaging and confirmation (replacing alert/confirm)
	const [systemMessage, setSystemMessage] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const showMessage = (msg) => {
		setSystemMessage(msg);
		setTimeout(() => setSystemMessage(null), 3000);
	};

	const authHeader = useCallback(() => {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}, []);

	const fetchAssets = useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${apiBase}/assets`, { headers: authHeader() });
			console.log('[Assignments] fetchAssets response:', res?.data);
			const payload = res && res.data;
			if (Array.isArray(payload)) setAssets(payload);
			else if (payload && Array.isArray(payload.assets)) setAssets(payload.assets);
			else if (payload && Array.isArray(payload.data)) setAssets(payload.data);
			else setAssets([]);
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	}, [authHeader]);

	useEffect(() => { fetchAssets(); }, [fetchAssets]);

	async function upload(e) {
		e.preventDefault();
		const file = fileRef.current.files[0];
		if (!file) return showMessage('Please choose a file to upload.');

		const form = new FormData();
		form.append('asset', file);

		try {
			await axios.post(`${apiBase}/assets/upload`, form, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } });
			fetchAssets();
			fileRef.current.value = null;
			showMessage('File uploaded successfully!');
		} catch (err) {
			console.error(err);
			showMessage('Upload failed. Please try again.');
		}
	}

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setShowConfirmModal(true);
	};

	async function delConfirmed() {
		if (!deleteId) return;
		setShowConfirmModal(false);
		try {
			await axios.delete(`${apiBase}/assets/${deleteId}`, { headers: authHeader() });
			setAssets(prev => prev.filter(a => a._id !== deleteId));
			showMessage('File deleted.');
		} catch (err) {
			console.error(err);
			showMessage('Delete failed.');
		}
		setDeleteId(null);
	}

	// Simple Custom Modal Component for Confirmation
	const ConfirmModal = ({ message, onConfirm, onClose }) => (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
				<p className="mb-4 text-gray-700">{message}</p>
				<div className="flex justify-end gap-3">
					<button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition">
						Cancel
					</button>
					<button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">
						Delete
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6 text-gray-800">Assignments (Manage)</h1>

					{/* System Message Display */}
					{systemMessage && (
						<div className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded shadow-lg z-50 transition-opacity duration-300">
							{systemMessage}
						</div>
					)}

					<form onSubmit={upload} className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
						<h2 className="text-xl font-semibold mb-4 text-gray-700">Upload New Assignment</h2>
						<div className="flex flex-col md:flex-row items-center gap-4">
							<input ref={fileRef} type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
							<button type="submit" className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-150 shadow-md">Upload as Assignment</button>
						</div>
					</form>

					{loading ? <div className="text-center p-10 text-gray-500">Loading assignments...</div> : (
						<div className="space-y-4">
							{assets.length === 0 ? (
								<div className="text-center p-10 text-gray-500 bg-white rounded-xl shadow-lg">No assignments uploaded yet.</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{assets.map(a => (
										<div key={a._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center border border-gray-100 hover:shadow-lg transition">
											<div>
												<div className="font-semibold text-gray-800 truncate max-w-[200px]">{a.fileName}</div>
												<div className="text-xs text-slate-500 mt-1">{a.mimeType} · {Math.round((a.size || 0) / 1024)} KB</div>
											</div>
											<div className="flex items-center gap-3">
												<a href={getFileUrl(a.filePath)} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 transition">View</a>
												<button onClick={() => handleDeleteClick(a._id)} className="text-sm text-red-600 hover:text-red-800 transition">Delete</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</main>
			{showConfirmModal && deleteId && (
				<ConfirmModal
					message="Are you sure you want to delete this assignment file? This action cannot be undone."
					onConfirm={delConfirmed}
					onClose={() => { setShowConfirmModal(false); setDeleteId(null); }}
				/>
			)}
		</div>
	);
}
