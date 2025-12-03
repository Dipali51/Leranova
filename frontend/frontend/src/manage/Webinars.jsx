import React, { useEffect, useState } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function WebinarsManage() {
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ title: '', description: '', date: '', duration: '' });
	const apiBase = '/api';

	useEffect(() => { fetch(); }, []);

	const authHeader = () => { const t = localStorage.getItem('token'); return t ? { Authorization: `Bearer ${t}` } : {}; };

	async function fetch() { setLoading(true); try { /* backend lacks webinar endpoints - show empty state */ setList([]); } catch (err) { console.error(err); } setLoading(false); }

	async function create(e) { e.preventDefault(); alert('This app does not currently expose webinar create via API.'); }

	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8 pt-16 bg-gray-50">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Webinars</h1>
					<div className="mb-6 bg-white p-4 rounded shadow-sm">
						<div className="text-sm text-slate-500">Webinar endpoints not configured in backend. Use the Courses → Create Webinar flow or add webinar API endpoints to enable this page.</div>
					</div>

					{loading ? <div>Loading...</div> : (
						list.length === 0 ? <div className="text-slate-500">No webinars available</div> : (
							<div className="space-y-3">{list.map(w => <div key={w._id} className="bg-white p-3 rounded shadow-sm">{w.title}</div>)}</div>
						)
					)}
				</div>
			</main>
		</div>
	);
}

