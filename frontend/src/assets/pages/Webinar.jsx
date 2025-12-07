import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { Link, useNavigate } from "react-router-dom";
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaCommentDots, FaCalendarAlt, FaVideo, FaClock, FaLink } from "react-icons/fa";

export default function Webinar() {
    const [role, setRole] = useState(null);
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [toast, setToast] = useState({ visible: false, message: '' });

    useEffect(() => {
        // Get role from localStorage
        const userRole = localStorage.getItem("role");
        setRole(userRole);
        console.log("👤 User role:", userRole);
    }, []);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found, redirecting to login");
                    navigate("/login");
                    return;
                }

                console.log("🔄 Fetching webinars with token:", token.substring(0, 20) + "...");

                // TODO: Replace with real API when backend webinar API is ready
                /*
                const res = await axios.get("http://localhost:3001/api/webinars", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                setWebinars(res.data);
                */

                // For now, use localStorage to persist webinars (similar to packages)
                const userId = getUserIdFromToken(token);
                if (userId) {
                    const userWebinarsKey = `userWebinars_${userId}`;
                    const storedWebinars = localStorage.getItem(userWebinarsKey);

                    if (storedWebinars) {
                        try {
                            const parsedWebinars = JSON.parse(storedWebinars);
                            setWebinars(parsedWebinars);
                            console.log("✅ Loaded", parsedWebinars.length, "webinars for user", userId);
                        } catch (error) {
                            console.error("Error parsing stored webinars:", error);
                            setWebinars([]);
                        }
                    } else {
                        setWebinars([]);
                        console.log("📺 No webinars found for user", userId);
                    }
                }

            } catch (err) {
                console.error("❌ Error fetching webinars:", err);

                if (err.response && err.response.status === 401) {
                    alert("Session expired. Please login again.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWebinars();
    }, [navigate]);

    const getUserIdFromToken = (token) => {
        try {
            const base64Payload = token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            return payload.id;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const copyToClipboard = async (text) => {
        try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            setToast({ visible: true, message: 'Link copied to clipboard' });
            setTimeout(() => setToast({ visible: false, message: '' }), 2000);
        } catch (err) {
            console.error('Copy failed', err);
            alert('Failed to copy link. You can manually copy: ' + text);
        }
    };

    const getWebinarStatus = (webinar) => {
        const now = new Date();
        const startTime = new Date(webinar.startTime);
        const endTime = new Date(webinar.endTime);

        if (now < startTime) {
            return { status: 'upcoming', color: 'bg-blue-500', text: 'Upcoming' };
        } else if (now >= startTime && now <= endTime) {
            return { status: 'live', color: 'bg-red-500', text: 'Live Now' };
        } else {
            return { status: 'completed', color: 'bg-gray-500', text: 'Completed' };
        }
    };

    const handleDeleteWebinar = (webinarId) => {
        if (!window.confirm("Are you sure you want to delete this webinar?")) {
            return;
        }

        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        if (userId) {
            const updatedWebinars = webinars.filter(webinar => webinar._id !== webinarId);
            setWebinars(updatedWebinars);

            const userWebinarsKey = `userWebinars_${userId}`;
            localStorage.setItem(userWebinarsKey, JSON.stringify(updatedWebinars));
            console.log("✅ Webinar deleted for user", userId);
        }

        alert("✅ Webinar deleted successfully!");
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                {/* Topbar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">My Webinars ({webinars.length})</h2>
                    {role === "teacher" && (
                        <Link to="/webinar/create">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
                                <FaVideo /> Create Webinar
                            </button>
                        </Link>
                    )}
                </div>

                {/* Filter and Search */}
                <div className="flex justify-between items-center mb-6">
                    <button className="border px-4 py-2 rounded">Add Filters</button>
                    <input
                        type="text"
                        placeholder="Search webinars..."
                        className="border p-2 rounded w-1/2"
                    />
                    <div className="flex space-x-2">
                        <button className="border p-2 rounded">List</button>
                        <button className="bg-purple-600 text-white p-2 rounded">Grid</button>
                    </div>
                </div>

                {/* Webinar Cards */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading webinars...</p>
                        </div>
                    </div>
                ) : webinars.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📺</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No webinars found</h3>
                        <p className="text-gray-500">
                            {role === "teacher"
                                ? "Create your first webinar to get started!"
                                : "No webinars available at the moment."
                            }
                        </p>
                        {role === "teacher" && (
                            <Link to="/webinar/create">
                                <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                                    + Create Your First Webinar
                                </button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {webinars.map((webinar) => {
                            const statusInfo = getWebinarStatus(webinar);

                            return (
                                <div
                                    key={webinar._id}
                                    className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
                                >
                                    {/* Cover */}
                                    <div className="h-40 bg-gradient-to-r from-purple-600 to-blue-600 relative cursor-pointer"
                                        onClick={() => navigate(`/webinars/edit/${webinar._id}`)}>
                                        {webinar.coverImage ? (
                                            <img
                                                src={webinar.coverImage}
                                                alt="Webinar Cover"
                                                className="object-cover h-full w-full"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-white">
                                                <FaVideo className="text-6xl opacity-50" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className={`absolute top-3 right-3 ${statusInfo.color} text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1`}>
                                            {statusInfo.status === 'live' && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold">{webinar.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{webinar.description}</p>

                                        <div className="space-y-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-600" />
                                                <span>{new Date(webinar.startTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-purple-600" />
                                                <span>
                                                    {new Date(webinar.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(webinar.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-sm mt-2 font-medium">
                                                Attendees: {webinar.registeredCount || 0} / {webinar.maxAttendees || 'Unlimited'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Icon Bar */}
                                    <div className="border-t flex justify-between items-center px-4 py-2 text-xl">
                                        <FaInfoCircle
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            onClick={() => alert(`Webinar Info:\nTitle: ${webinar.title}\nDescription: ${webinar.description}\nDate: ${new Date(webinar.startTime).toLocaleDateString()}\nTime: ${new Date(webinar.startTime).toLocaleTimeString()}`)}
                                            title="Webinar Information"
                                        />
                                        <FaWrench
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            onClick={() => navigate(`/webinars/edit/${webinar._id}`)}
                                            title="Edit Webinar"
                                        />
                                        <FaPen
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            onClick={() => navigate(`/webinars/content/${webinar._id}`)}
                                            title="Edit Content"
                                        />
                                        <FaUsers
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            onClick={() => alert(`Webinar Attendance:\nWebinar: ${webinar.title}\nRegistered: ${webinar.registeredCount || 0}\nAttended: ${webinar.attendedCount || 0}\nNo-shows: ${(webinar.registeredCount || 0) - (webinar.attendedCount || 0)}`)}
                                            title="View Attendees"
                                        />
                                        <FaLink
                                            onClick={() => copyToClipboard(window.location.origin + `/webinars/preview/${webinar._id}`)}
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            title="Copy webinar link"
                                        />
                                        <FaCommentDots
                                            className="text-gray-600 cursor-pointer hover:text-purple-600 transition"
                                            onClick={() => alert(`Webinar Feedback:\nWebinar: ${webinar.title}\nRating: ${webinar.rating || 'No ratings yet'}\nReviews: ${webinar.reviewCount || 0} reviews\nQ&A Questions: ${webinar.questionCount || 0}`)}
                                            title="View Q&A & Reviews"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    {role === "teacher" && (
                                        <div className="px-4 pb-4">
                                            {statusInfo.status === 'upcoming' && (
                                                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2">
                                                    Start Webinar
                                                </button>
                                            )}
                                            {statusInfo.status === 'live' && (
                                                <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mb-2">
                                                    Join Live Session
                                                </button>
                                            )}
                                            {statusInfo.status === 'completed' && (
                                                <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition mb-2">
                                                    View Recording
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDeleteWebinar(webinar._id)}
                                                className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition text-sm"
                                            >
                                                Delete Webinar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Toast */}
            {toast.visible && (
                <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast.message}
                </div>
            )}
        </div>
    );
}
