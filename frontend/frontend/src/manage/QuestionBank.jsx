import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../layout/Sidebar';
import axios from 'axios';

export default function QuestionBankManage() {
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({ question: '', choices: '', answer: '' });

	// State for custom messaging and confirmation (replacing alert/confirm)
	const [systemMessage, setSystemMessage] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);

	const showMessage = (msg) => {
		setSystemMessage(msg);
		setTimeout(() => setSystemMessage(null), 3000);
	};
	const apiBase = '/api';

	const authHeader = useCallback(() => {
		const token = localStorage.getItem('token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}, []);

	useEffect(() => { fetchQuestions(); }, [authHeader]);

	useEffect(() => {
		console.log('[QuestionBank] mounted, current pathname=', typeof window !== 'undefined' ? window.location.pathname : 'server');
	}, []);

	async function fetchQuestions() {
		setLoading(true);
		try {
			const res = await axios.get(`${apiBase}/questions`, { headers: authHeader() });
			console.log('[QuestionBank] fetchQuestions response:', res?.data);
			// normalize response: API may return an array or an object like { questions: [...] }
			const payload = res && res.data;
			if (Array.isArray(payload)) {
				setQuestions(payload);
			} else if (payload && Array.isArray(payload.questions)) {
				setQuestions(payload.questions);
			} else if (payload && Array.isArray(payload.data)) {
				setQuestions(payload.data);
			} else {
				setQuestions([]);
			}
		} catch (err) { console.error(err); }
		setLoading(false);
	}

	async function createQuestion(e) {
		e.preventDefault();
		if (!form.question || !form.choices || !form.answer) {
			return showMessage('All fields are required.');
		}
		try {
			// ensure logged in
			const token = localStorage.getItem('token');
			if (!token) return showMessage('Login required to create questions.');
			const choicesArray = form.choices.split('|').map(s => s.trim()).filter(s => s.length > 0);
			if (!choicesArray.includes(form.answer.trim())) {
				return showMessage('The answer must be one of the provided choices.');
			}
			const payload = { question: form.question, choices: choicesArray, answer: form.answer.trim() };
			await axios.post(`${apiBase}/questions`, payload, { headers: authHeader() });
			setForm({ question: '', choices: '', answer: '' });
			fetchQuestions();
			showMessage('Question created successfully!');
		} catch (err) {
			console.error('Create question failed', err);
			const serverMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to create question.';
			showMessage(serverMsg);
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
			await axios.delete(`${apiBase}/questions/${deleteId}`, { headers: authHeader() });
			setQuestions(q => q.filter(x => x._id !== deleteId));
			showMessage('Question deleted.');
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
					<h1 className="text-3xl font-bold mb-6 text-gray-800">Question Bank Management</h1>

					{/* System Message Display */}
					{systemMessage && (
						<div className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded shadow-lg z-50 transition-opacity duration-300">
							{systemMessage}
						</div>
					)}

					<form onSubmit={createQuestion} className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
						<h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Multiple-Choice Question</h2>
						<div className="mb-3">
							<label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
							<input
								value={form.question}
								onChange={e => setForm({ ...form, question: e.target.value })}
								className="w-full border px-3 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
								placeholder="What is the capital of France?"
							/>
						</div>
						<div className="mb-3">
							<label className="block text-sm font-medium text-gray-700 mb-1">Choices (separate with | )</label>
							<input
								value={form.choices}
								onChange={e => setForm({ ...form, choices: e.target.value })}
								className="w-full border px-3 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
								placeholder="Paris | London | Rome | Berlin"
							/>
							<p className="text-xs text-gray-500 mt-1">E.g., Option A | Option B | Option C</p>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
							<input
								value={form.answer}
								onChange={e => setForm({ ...form, answer: e.target.value })}
								className="w-full border px-3 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
								placeholder="Paris"
							/>
							<p className="text-xs text-gray-500 mt-1 text-red-500">Must exactly match one of the choices.</p>
						</div>
						<div className="text-right">
							<button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-150 shadow-md">Create Question</button>
						</div>
					</form>

					{loading ? <div className="text-center p-10 text-gray-500">Loading questions...</div> : (
						<div className="space-y-4">
							{questions.length === 0 ? (
								<div className="text-center p-10 text-gray-500 bg-white rounded-xl shadow-lg">No questions in the bank yet.</div>
							) : (
								questions.map(q => (
									<div key={q._id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-start border border-gray-100 hover:shadow-lg transition">
										<div>
											<div className="font-semibold text-gray-800">{q.question}</div>
											<div className="text-sm text-slate-500 mt-2">
												<span className="font-medium">Choices:</span> {Array.isArray(q.choices) ? q.choices.join(' | ') : (q.choices || '')}
											</div>
											<div className="text-sm font-bold text-green-600 mt-1">
												Answer: {q.answer}
											</div>
										</div>
										<div className="text-right flex-shrink-0">
											<button onClick={() => handleDeleteClick(q._id)} className="text-sm text-red-600 hover:text-red-800 transition py-1 px-3 rounded-full border border-red-200 hover:bg-red-50">Delete</button>
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</main>
			{showConfirmModal && deleteId && (
				<ConfirmModal
					message="Are you sure you want to delete this question? This action cannot be undone."
					onConfirm={delConfirmed}
					onClose={() => { setShowConfirmModal(false); setDeleteId(null); }}
				/>
			)}
		</div>
	);
}
