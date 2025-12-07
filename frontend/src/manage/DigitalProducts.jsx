import React, { useEffect, useState, useRef, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function DigitalProductsManage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const fileRef = useRef(null);
	const apiBase = '/api';

	const getFileUrl = (filePath) => {
		if (!filePath) return filePath;
		if (/^https?:\/\//i.test(filePath)) return filePath;
		try { return new URL(filePath, window.location.origin).toString(); } catch { return `http://localhost:3001${filePath.startsWith('/') ? '' : '/'}${filePath}`; }
	};

	const authHeader = useCallback(() => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; }, []);

	const fetchProducts = useCallback(async () => { setLoading(true); try { const res = await axios.get(`${apiBase}/assets`, { headers: authHeader() }); setProducts(res.data || []); } catch (err) { console.error(err); } setLoading(false); }, [authHeader]);

	useEffect(() => { fetchProducts(); }, [fetchProducts]);

	async function upload(e) { e.preventDefault(); const f = fileRef.current.files[0]; if (!f) return alert('Choose file'); const form = new FormData(); form.append('asset', f); try { await axios.post(`${apiBase}/assets/upload`, form, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } }); fetchProducts(); fileRef.current.value = null; } catch (err) { console.error(err); alert('Upload failed'); } }

	async function del(id) { if (!confirm('Delete product?')) return; try { await axios.delete(`${apiBase}/assets/${id}`, { headers: authHeader() }); setProducts(p => p.filter(x => x._id !== id)); } catch (err) { console.error(err); alert('Delete failed'); } }

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Digital Products</h1>
					<form onSubmit={upload} className="mb-6 bg-white p-4 rounded shadow-sm">
						<div className="flex items-center gap-3">
							<input ref={fileRef} type="file" />
							<button className="px-3 py-1 bg-indigo-600 text-white rounded">Upload product</button>
						</div>
					</form>

					{loading ? <div>Loading...</div> : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{products.map(p => (
								<div key={p._id} className="bg-white p-3 rounded shadow-sm flex justify-between">
									<div>
										<div className="font-medium truncate" style={{ maxWidth: 300 }}>{p.fileName}</div>
										<div className="text-sm text-slate-500">{p.mimeType} · {Math.round((p.size || 0) / 1024)} KB</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<a href={getFileUrl(p.filePath)} className="text-indigo-600" target="_blank" rel="noreferrer">Open</a>
										<button onClick={() => del(p._id)} className="text-red-600">Delete</button>
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

