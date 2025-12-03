import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function MembershipsManage() {
	const [list, setList] = useState([]);
	const [form, setForm] = useState({ title: '', description: '', price: '' });
	const [loading, setLoading] = useState(true);
	const apiBase = '/api';

	useEffect(() => { fetchList(); }, []);

	const authHeader = () => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; };

	async function fetchList() { setLoading(true); try { const res = await axios.get(`${apiBase}/memberships`, { headers: authHeader() }); setList(res.data || []); } catch (err) { console.error(err); } setLoading(false); }

	async function create(e) { e.preventDefault(); try { await axios.post(`${apiBase}/memberships`, { title: form.title, description: form.description, price: Number(form.price) }, { headers: authHeader() }); setForm({ title: '', description: '', price: '' }); fetchList(); } catch (err) { console.error(err); alert('Create failed'); } }

	async function del(id) { if (!confirm('Delete membership?')) return; try { await axios.delete(`${apiBase}/memberships/${id}`, { headers: authHeader() }); setList(prev => prev.filter(x => x._id !== id)); } catch (err) { console.error(err); alert('Delete failed'); } }

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Memberships</h1>
					<form onSubmit={create} className="mb-6 bg-white p-4 rounded shadow-sm">
						<div className="mb-2"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border px-2 py-1 rounded" /></div>
						<div className="mb-2"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border px-2 py-1 rounded" rows={3} /></div>
						<div className="mb-2"><input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price" className="w-full border px-2 py-1 rounded" /></div>
						<div className="text-right"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button></div>
					</form>

					{loading ? <div>Loading...</div> : (
						<div className="space-y-3">
							{list.map(m => (
								<div key={m._id} className="bg-white p-3 rounded shadow-sm flex justify-between">
									<div>
										<div className="font-medium">{m.title} — ₹{m.price}</div>
										<div className="text-sm text-slate-500">{m.description}</div>
									</div>
									<div><button onClick={() => del(m._id)} className="text-red-600">Delete</button></div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

