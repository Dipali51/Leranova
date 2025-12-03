import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function DiscussionsManage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ title: '', content: '' });
	const apiBase = '/api';

	useEffect(() => { fetchDiscussions(); }, []);

	const authHeader = () => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; };

	async function fetchDiscussions() {
		setLoading(true);
		try { const res = await axios.get(`${apiBase}/discussions`, { headers: authHeader() }); setItems(res.data || []); }
		catch (err) { console.error(err); }
		setLoading(false);
	}

	async function create(e) {
		e.preventDefault();
		try { await axios.post(`${apiBase}/discussions`, form, { headers: authHeader() }); setForm({ title: '', content: '' }); fetchDiscussions(); }
		catch (err) { console.error(err); alert('Failed to create discussion'); }
	}

	async function del(id) {
		if (!confirm('Delete discussion?')) return;
		try { await axios.delete(`${apiBase}/discussions/${id}`, { headers: authHeader() }); setItems(prev => prev.filter(x => x._id !== id)); }
		catch (err) { console.error(err); alert('Delete failed'); }
	}

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Discussions</h1>
					<form onSubmit={create} className="mb-6 bg-white p-4 rounded shadow-sm">
						<div className="mb-2"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border px-2 py-1 rounded" /></div>
						<div className="mb-2"><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Content" className="w-full border px-2 py-1 rounded" rows={4} /></div>
						<div className="text-right"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button></div>
					</form>

					{loading ? <div>Loading...</div> : (
						<div className="space-y-3">
							{items.map(it => (
								<div key={it._id} className="bg-white p-3 rounded shadow-sm flex justify-between">
									<div>
										<div className="font-medium">{it.title}</div>
										<div className="text-sm text-slate-500">{it.content}</div>
									</div>
									<div>
										<button onClick={() => del(it._id)} className="text-red-600">Delete</button>
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

