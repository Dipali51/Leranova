import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function RatingsManage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const apiBase = '/api';

	useEffect(() => { fetch(); }, []);

	const authHeader = () => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; };

	async function fetch() { setLoading(true); try { const res = await axios.get(`${apiBase}/reviews`, { headers: authHeader() }); setItems(res.data || []); } catch (err) { console.error(err); } setLoading(false); }

	async function del(id) { if (!confirm('Delete review?')) return; try { await axios.delete(`${apiBase}/reviews/${id}`, { headers: authHeader() }); setItems(prev => prev.filter(x => x._id !== id)); } catch (err) { console.error(err); alert('Delete failed'); } }

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Ratings & Reviews</h1>
					{loading ? <div>Loading...</div> : (
						<div className="space-y-3">
							{items.map(r => (
								<div key={r._id} className="bg-white p-3 rounded shadow-sm flex justify-between">
									<div>
										<div className="font-medium">{r.targetType} — {r.targetId}</div>
										<div className="text-sm text-slate-500">{r.comment}</div>
										<div className="text-xs text-slate-400">Rating: {r.rating}</div>
									</div>
									<div><button onClick={() => del(r._id)} className="text-red-600">Delete</button></div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

