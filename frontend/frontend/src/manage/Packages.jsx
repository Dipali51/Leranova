import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function PackagesManage() {
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ title: '', price: '' });
	const apiBase = '/api';

	useEffect(() => { fetchList(); }, []);

	const authHeader = () => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; };

	async function fetchList() { setLoading(true); try { const res = await axios.get(`${apiBase}/packages`, { headers: authHeader() }); setList(res.data || []); } catch (err) { console.error(err); } setLoading(false); }

	async function create(e) { e.preventDefault(); try { await axios.post(`${apiBase}/packages`, { title: form.title, price: Number(form.price) }, { headers: authHeader() }); setForm({ title: '', price: '' }); fetchList(); } catch (err) { console.error(err); alert('Create failed'); } }

	async function del(id) { if (!confirm('Delete package?')) return; try { await axios.delete(`${apiBase}/packages/${id}`, { headers: authHeader() }); setList(prev => prev.filter(x => x._id !== id)); } catch (err) { console.error(err); alert('Delete failed'); } }

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Packages</h1>
					<form onSubmit={create} className="mb-6 bg-white p-4 rounded shadow-sm">
						<div className="mb-2"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border px-2 py-1 rounded" /></div>
						<div className="mb-2"><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" className="w-full border px-2 py-1 rounded" /></div>
						<div className="text-right"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button></div>
					</form>

					{loading ? <div>Loading...</div> : (
						<div className="space-y-3">
							{list.map(p => (
								<div key={p._id} className="bg-white p-3 rounded shadow-sm flex justify-between">
									<div>
										<div className="font-medium">{p.title} — ₹{p.price}</div>
										<div className="text-sm text-slate-500">{p.description || ''}</div>
									</div>
									<div><button onClick={() => del(p._id)} className="text-red-600">Delete</button></div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

