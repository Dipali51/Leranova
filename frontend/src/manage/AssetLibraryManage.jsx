import React, { useEffect, useState, useRef, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function AssetLibraryManage() {
	const [assets, setAssets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState(new Set());
	const [dragOver, setDragOver] = useState(false);
	const fileRef = useRef(null);

	// Use relative API base so the app can work with a proxy or with same-origin backend
	const apiBase = '/api';

	// Return a full URL for files served from backend /uploads
	function getFileUrl(filePath) {
		if (!filePath) return '';
		// If filePath already appears absolute (http), return as-is
		if (/^https?:\/\//i.test(filePath)) return filePath;
		// If it already includes host (rare), return
		if (filePath.startsWith('//')) return window.location.protocol + filePath;
		// Default backend origin: assume backend runs on port 3001 in dev
		const host = window.location.hostname || 'localhost';
		// If frontend is served from same origin and proxy is configured, use relative path
		const usingProxy = window.location.port && (window.location.port === '5173' || window.location.port === '3000');
		if (usingProxy) {
			// If proxy configured in Vite to forward /api but not /uploads, still return absolute backend URL
			return `http://${host}:3001${filePath}`;
		}
		return filePath;
	}

	useEffect(() => {
		fetchAssets();
	}, []);

	const authHeader = useCallback(() => {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}, []);

	async function fetchAssets() {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`${apiBase}/assets`, { headers: authHeader() });
			// normalize array
			setAssets(Array.isArray(res.data) ? res.data : (res.data.assets || []));
		} catch (err) {
			console.error('Failed to load assets', err);
			setError('Failed to load assets. Is the backend running?');
		} finally {
			setLoading(false);
		}
	}

	async function uploadFile(file) {
		const form = new FormData();
		form.append('asset', file);
		setUploading(true);
		setUploadProgress(0);
		try {
			// require authentication token
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Login required: no token found. Please sign in before uploading.');

			const res = await axios.post(`${apiBase}/assets/upload`, form, {
				headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
				onUploadProgress: p => {
					const pct = Math.round((p.loaded / p.total) * 100);
					setUploadProgress(pct);
				}
			});
			// fetch updated list or append
			fetchAssets();
			return res.data;
		} catch (err) {
			// Improve error message for user and console
			console.error('Upload failed', err);
			const serverMessage = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Upload failed';
			setError(serverMessage);
			// also surface a friendly dialog for immediate feedback
			alert(`Upload failed: ${serverMessage}`);
			throw err;
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	}

	async function handleUpload(e) {
		e.preventDefault();
		const file = fileRef.current && fileRef.current.files && fileRef.current.files[0];
		if (!file) return alert('Choose a file to upload');
		await uploadFile(file);
		if (fileRef.current) fileRef.current.value = null;
	}

	async function handleDropUpload(files) {
		if (!files || files.length === 0) return;
		// upload files sequentially to avoid saturating
		for (let i = 0; i < files.length; i++) {
			try { await uploadFile(files[i]); } catch (e) { /* continue */ }
		}
	}

	async function handleDelete(id) {
		if (!confirm('Delete this asset?')) return;
		try {
			await axios.delete(`${apiBase}/assets/${id}`, { headers: authHeader() });
			setAssets(prev => prev.filter(a => a._id !== id));
			setSelected(prev => { const copy = new Set(prev); copy.delete(id); return copy; });
		} catch (err) {
			console.error('Delete failed', err);
			alert('Delete failed');
		}
	}

	async function handleBulkDelete() {
		if (selected.size === 0) return alert('No assets selected');
		if (!confirm(`Delete ${selected.size} selected asset(s)?`)) return;
		try {
			const ids = Array.from(selected);
			await Promise.all(ids.map(id => axios.delete(`${apiBase}/assets/${id}`, { headers: authHeader() })));
			setAssets(prev => prev.filter(a => !selected.has(a._id)));
			setSelected(new Set());
		} catch (err) {
			console.error('Bulk delete failed', err);
			alert('Bulk delete failed');
		}
	}

	const toggleSelect = id => {
		setSelected(prev => { const copy = new Set(prev); copy.has(id) ? copy.delete(id) : copy.add(id); return copy; });
	};

	const clearSelection = () => setSelected(new Set());

	const filtered = assets.filter(a => {
		if (!query) return true;
		const q = query.toLowerCase();
		return (a.fileName || '').toLowerCase().includes(q) || (a.mimeType || '').toLowerCase().includes(q);
	});

	// small utility to render human size
	const prettySize = s => {
		if (!s) return '';
		if (s < 1024) return `${s} B`;
		if (s < 1024 * 1024) return `${Math.round(s / 1024)} KB`;
		return `${Math.round(s / (1024 * 1024))} MB`;
	};

	// drag & drop handlers
	function onDragOver(e) { e.preventDefault(); setDragOver(true); }
	function onDragLeave(e) { e.preventDefault(); setDragOver(false); }
	function onDrop(e) { e.preventDefault(); setDragOver(false); const files = e.dataTransfer.files; handleDropUpload(files); }

	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 p-8 bg-gray-50 pt-16">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-semibold text-slate-900">Asset Library</h1>
							<p className="text-sm text-slate-500">Manage images, PDFs and other media used across your courses.</p>
						</div>

						<div className="flex items-center gap-3">
							<div className="relative">
								<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assets by name or type" className="w-72 px-3 py-2 rounded border bg-white text-sm shadow-sm" />
							</div>
							<label className="flex items-center gap-2 cursor-pointer">
								<input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files && uploadFile(e.target.files[0])} />
								<span className="px-4 py-2 bg-indigo-600 text-white rounded text-sm">Upload</span>
							</label>
						</div>
					</div>

					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<label className="inline-flex items-center gap-2 text-sm">
								<input type="checkbox" className="form-checkbox" onChange={e => {
									if (e.target.checked) setSelected(new Set(assets.map(a => a._id)));
									else clearSelection();
								}} checked={selected.size === assets.length && assets.length > 0} />
								<span>Select all</span>
							</label>
							<button onClick={handleBulkDelete} disabled={selected.size === 0} className={`px-3 py-1 rounded text-sm ${selected.size === 0 ? 'bg-gray-200 text-gray-500' : 'bg-red-600 text-white'}`}>Delete selected</button>
							<div className="text-sm text-slate-500">{selected.size} selected</div>
						</div>

						<div className="text-sm text-slate-500">{assets.length} assets</div>
					</div>

					<div className={`p-6 rounded border-dashed ${dragOver ? 'border-2 border-indigo-300 bg-indigo-50' : 'border border-transparent'} mb-6`} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m0 0l-3-3m3 3l-3 3"></path></svg>
								<div>
									<div className="font-medium">Drag & drop files to upload</div>
									<div className="text-sm text-slate-500">Or click <span className="font-medium">Upload</span> to choose files</div>
								</div>
							</div>
							<div>
								{uploading && (
									<div className="w-60 bg-white rounded shadow-sm px-3 py-2 flex items-center gap-3">
										<div className="flex-1">
											<div className="text-sm">Uploading…</div>
											<div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden"><div style={{ width: `${uploadProgress}%` }} className="h-2 bg-indigo-600" /></div>
										</div>
										<div className="text-xs text-slate-500">{uploadProgress}%</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Content area */}
					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{[...Array(8)].map((_, i) => (
								<div key={i} className="animate-pulse p-4 bg-white rounded shadow-sm">
									<div className="h-40 bg-gray-100 mb-4 rounded" />
									<div className="h-4 bg-gray-100 w-3/4 mb-2 rounded" />
									<div className="h-3 bg-gray-100 w-1/2 rounded" />
								</div>
							))}
						</div>
					) : error ? (
						<div className="p-8 bg-white rounded text-red-600">{error}</div>
					) : filtered.length === 0 ? (
						<div className="p-12 text-center bg-white rounded">
							<img alt="empty" src="https://cdn.sanity.io/images/0vv8moc6/dummy/empty-box.png?w=200&h=120&fit=crop" className="mx-auto mb-6 opacity-60" />
							<div className="text-lg font-medium">No assets yet</div>
							<div className="text-sm text-slate-500 mb-4">Upload files or drag them into this area to get started.</div>
							<div className="flex items-center justify-center">
								<label className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer"><input type="file" className="hidden" onChange={e => e.target.files && handleDropUpload(e.target.files)} />Upload files</label>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{filtered.map(a => (
								<div key={a._id} className="bg-white rounded shadow-sm overflow-hidden border">
									<div className="relative h-44 bg-gray-50 flex items-center justify-center">
										{a.mimeType && a.mimeType.startsWith('image/') ? (
											<img
												src={getFileUrl(a.filePath)}
												alt={a.fileName}
												className="object-contain h-full w-full"
												onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/image-placeholder.png'; }}
											/>
										) : (
											<div className="flex flex-col items-center gap-2 text-slate-500">
												<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" /></svg>
												<div className="text-sm">{a.mimeType || 'file'}</div>
											</div>
										)}
										<input aria-label={`select-${a._id}`} type="checkbox" checked={selected.has(a._id)} onChange={() => toggleSelect(a._id)} className="absolute top-2 left-2 w-5 h-5 rounded border bg-white p-0" />
									</div>
									<div className="p-3 flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<div className="font-medium truncate">{a.fileName}</div>
											<div className="text-xs text-slate-500">{a.mimeType} · {prettySize(a.size)}</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<a className="text-sm text-indigo-600" target="_blank" rel="noreferrer" href={getFileUrl(a.filePath)}>Open</a>
											<button onClick={async () => {
												try { await handleDelete(a._id); } catch (err) { console.error('Delete err', err); alert(err?.response?.data?.error || 'Delete failed'); }
											}} className="text-sm text-red-600">Delete</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
