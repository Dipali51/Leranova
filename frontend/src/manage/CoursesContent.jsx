import React from 'react';
import Sidebar from '../layout/Sidebar';

export default function CoursesContentManage() {
	return (
		<div className="flex">
			<Sidebar />
			<main className="flex-1 p-8">
				<h1 className="text-2xl font-semibold mb-4">Courses Content (Manage)</h1>
				<p className="text-gray-600">Placeholder for courses content management.</p>
			</main>
		</div>
	);
}

