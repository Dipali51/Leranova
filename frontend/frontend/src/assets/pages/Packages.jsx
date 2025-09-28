import React, { useEffect, useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import axios from 'axios';
import { FaInfoCircle, FaWrench, FaPen, FaUsers, FaEye, FaCommentDots, FaPlus, FaTrash, FaBook } from "react-icons/fa";

export default function Packages() {
    const [role, setRole] = useState(null);
    const [packages, setPackages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPackage, setNewPackage] = useState({
        title: '',
        description: '',
        totalPrice: '',
        discountedPrice: '',
        selectedCourses: [],
        duration: ''
    });

    useEffect(() => {
        // Get role from localStorage
        const userRole = localStorage.getItem("role");
        setRole(userRole);

        // Load initial data
        fetchPackages();
        fetchCourses();
    }, []);

    const fetchPackages = () => {
        // Get current user's ID from token
        const token = localStorage.getItem("token");
        let userId = null;

        if (token) {
            try {
                // Decode JWT token to get user ID (basic decode, not secure but works for client)
                const base64Payload = token.split('.')[1];
                const payload = JSON.parse(atob(base64Payload));
                userId = payload.id;
                console.log("📋 Current user ID:", userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        if (!userId) {
            console.log("❌ No user ID found, cannot load packages");
            setPackages([]);
            return;
        }

        // Get packages for this specific user from localStorage
        const userPackagesKey = `userPackages_${userId}`;
        const storedPackages = localStorage.getItem(userPackagesKey);

        if (storedPackages) {
            try {
                const parsedPackages = JSON.parse(storedPackages);
                setPackages(parsedPackages);
                console.log("✅ Loaded", parsedPackages.length, "packages for user", userId);
            } catch (error) {
                console.error("Error parsing stored packages:", error);
                setPackages([]);
            }
        } else {
            setPackages([]);
            console.log("📦 No packages found for user", userId);
        }

        // TODO: When backend package API is ready, fetch real packages here:
        /*
        try {
          const response = await axios.get("http://localhost:3001/api/packages", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPackages(response.data);
        } catch (error) {
          console.error("Error fetching packages:", error);
          setPackages([]);
        }
        */
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found");
                return;
            }

            // Fetch real courses from your API
            const response = await axios.get("http://localhost:3001/api/courses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Transform the courses data to match our package format
            const transformedCourses = response.data.map(course => ({
                _id: course._id,
                title: course.title,
                description: course.description,
                price: course.discountedPrice || course.totalPrice || 0,
                coverImage: course.coverImage,
                pricingPlan: course.pricingPlan
            }));

            setCourses(transformedCourses);
            console.log("✅ Fetched", transformedCourses.length, "courses");

        } catch (error) {
            console.error("❌ Error fetching courses:", error);

            // Fallback to mock data if API fails
            const mockCourses = [
                { _id: 'c1', title: 'HTML & CSS Fundamentals', price: 1999 },
                { _id: 'c2', title: 'JavaScript Mastery', price: 2499 },
                { _id: 'c3', title: 'React.js Complete Guide', price: 2999 },
                { _id: 'c4', title: 'Python for Data Science', price: 2999 },
                { _id: 'c5', title: 'Machine Learning Algorithms', price: 3499 },
                { _id: 'c6', title: 'Deep Learning with TensorFlow', price: 3999 },
                { _id: 'c7', title: 'Node.js Backend Development', price: 2799 },
                { _id: 'c8', title: 'MongoDB Database Design', price: 1999 }
            ];

            setCourses(mockCourses);
            console.log("⚠️ Using mock data due to API error");
        }
    };

    const handleCreatePackage = (e) => {
        e.preventDefault();

        if (!newPackage.title || !newPackage.description || newPackage.selectedCourses.length < 2) {
            alert("Please fill all required fields and select at least 2 courses");
            return;
        }

        if (!newPackage.totalPrice || !newPackage.discountedPrice) {
            alert("Please set both total price and discounted price");
            return;
        }

        if (parseInt(newPackage.discountedPrice) >= parseInt(newPackage.totalPrice)) {
            alert("Discounted price should be less than total price");
            return;
        }

        const selectedCourseDetails = courses.filter(course =>
            newPackage.selectedCourses.includes(course._id)
        );

        const totalCoursesPrice = selectedCourseDetails.reduce((sum, course) => sum + course.price, 0);
        const savings = parseInt(newPackage.totalPrice) - parseInt(newPackage.discountedPrice);

        // Get current user ID
        const token = localStorage.getItem("token");
        let userId = null;

        if (token) {
            try {
                const base64Payload = token.split('.')[1];
                const payload = JSON.parse(atob(base64Payload));
                userId = payload.id;
            } catch (error) {
                console.error("Error decoding token:", error);
                alert("Error: Unable to identify user. Please login again.");
                return;
            }
        }

        if (!userId) {
            alert("Error: Please login to create packages.");
            return;
        }

        const createdPackage = {
            _id: Date.now().toString(),
            title: newPackage.title,
            description: newPackage.description,
            totalPrice: parseInt(newPackage.totalPrice),
            discountedPrice: parseInt(newPackage.discountedPrice),
            duration: newPackage.duration,
            courses: selectedCourseDetails,
            totalCoursesPrice: totalCoursesPrice,
            savings: savings,
            createdBy: userId, // Add creator ID
            createdAt: new Date().toISOString()
        };

        const updatedPackages = [...packages, createdPackage];
        setPackages(updatedPackages);

        // Save to localStorage with user-specific key
        const userPackagesKey = `userPackages_${userId}`;
        localStorage.setItem(userPackagesKey, JSON.stringify(updatedPackages));
        console.log("✅ Package saved for user", userId);

        setShowCreateModal(false);
        setNewPackage({
            title: '',
            description: '',
            totalPrice: '',
            discountedPrice: '',
            selectedCourses: [],
            duration: ''
        });

        alert("✅ Course package created successfully!");
    };

    const handleDeletePackage = (packageId) => {
        if (!window.confirm("Are you sure you want to delete this package?")) {
            return;
        }

        // Get current user ID
        const token = localStorage.getItem("token");
        let userId = null;

        if (token) {
            try {
                const base64Payload = token.split('.')[1];
                const payload = JSON.parse(atob(base64Payload));
                userId = payload.id;
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const updatedPackages = packages.filter(pkg => pkg._id !== packageId);
        setPackages(updatedPackages);

        // Update localStorage with user-specific key
        if (userId) {
            const userPackagesKey = `userPackages_${userId}`;
            localStorage.setItem(userPackagesKey, JSON.stringify(updatedPackages));
            console.log("✅ Package deleted for user", userId);
        }

        alert("✅ Package deleted successfully!");
    };

    const toggleCourseSelection = (courseId) => {
        const updatedSelection = newPackage.selectedCourses.includes(courseId)
            ? newPackage.selectedCourses.filter(id => id !== courseId)
            : [...newPackage.selectedCourses, courseId];

        setNewPackage({
            ...newPackage,
            selectedCourses: updatedSelection
        });
    };

    const calculateTotalCoursesPrice = () => {
        return courses
            .filter(course => newPackage.selectedCourses.includes(course._id))
            .reduce((sum, course) => sum + course.price, 0);
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">My Course Packages ({packages.length})</h2>
                        <p className="text-gray-600 mt-1">Bundle your created courses together and offer them at special pricing</p>
                    </div>
                    {role === "teacher" && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
                            disabled={courses.length < 2}
                        >
                            <FaPlus /> Create Package
                        </button>
                    )}
                </div>

                {courses.length < 2 && role === "teacher" && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-700">
                            <FaBook />
                            <span className="font-medium">You need at least 2 courses to create a package</span>
                        </div>
                        <p className="text-amber-600 text-sm mt-1">
                            Create more courses first, then come back to bundle them into packages.
                        </p>
                    </div>
                )}

                {/* Filter and Search */}
                <div className="flex justify-between items-center mb-6">
                    <button className="border px-4 py-2 rounded">Add Filters</button>
                    <input
                        type="text"
                        placeholder="Search packages..."
                        className="border p-2 rounded w-1/2"
                    />
                    <div className="flex space-x-2">
                        <button className="border p-2 rounded">List</button>
                        <button className="bg-purple-600 text-white p-2 rounded">Grid</button>
                    </div>
                </div>

                {/* Package Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Header */}
                            <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                <h3 className="text-xl font-bold">{pkg.title}</h3>
                                <p className="text-purple-100 text-sm mt-1">{pkg.description}</p>

                                <div className="mt-4 flex justify-between items-end">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold">₹{pkg.discountedPrice}</span>
                                            <span className="text-lg line-through text-purple-200">₹{pkg.totalPrice}</span>
                                        </div>
                                        <span className="text-purple-200 text-sm">Duration: {pkg.duration}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                                            Save ₹{pkg.savings}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Courses List */}
                            <div className="p-6">
                                <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                                    <FaBook className="text-purple-600" />
                                    Included Courses ({pkg.courses.length})
                                </h4>
                                <div className="space-y-2 mb-4">
                                    {pkg.courses.map((course, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <span className="text-sm text-gray-700">{course.title}</span>
                                            <span className="text-sm font-medium text-gray-600">₹{course.price}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Summary */}
                                <div className="border-t pt-3 space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total courses price:</span>
                                        <span>₹{pkg.totalCoursesPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Your savings:</span>
                                        <span>₹{pkg.savings}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Package price:</span>
                                        <span>₹{pkg.discountedPrice}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 pb-6">
                                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition mb-3">
                                    Purchase Package
                                </button>

                                {role === "teacher" && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3 text-gray-600">
                                            <FaInfoCircle
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Package Info:\nTitle: ${pkg.title}\nDescription: ${pkg.description}\nDuration: ${pkg.duration}\nCourses: ${pkg.courses.length}\nCreated: ${new Date(pkg.createdAt).toLocaleDateString()}`)}
                                                title="Package Information"
                                            />
                                            <FaWrench
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Edit Package:\nPackage: ${pkg.title}\nFeature coming soon - Edit package details, pricing, and course selection.`)}
                                                title="Edit Package"
                                            />
                                            <FaPen
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Edit Content:\nPackage: ${pkg.title}\nFeature coming soon - Edit package description and course content.`)}
                                                title="Edit Content"
                                            />
                                            <FaUsers
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Package Enrollment:\nPackage: ${pkg.title}\nEnrolled Students: ${pkg.enrolledStudents || 0}\nTotal Revenue: ₹${(pkg.enrolledStudents || 0) * pkg.discountedPrice}`)}
                                                title="View Students"
                                            />
                                            <FaEye
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Package Preview:\nTitle: ${pkg.title}\nPrice: ₹${pkg.discountedPrice} (Save ₹${pkg.savings})\nCourses: ${pkg.courses.map(c => c.title).join(', ')}`)}
                                                title="Preview Package"
                                            />
                                            <FaCommentDots
                                                className="cursor-pointer hover:text-purple-600 transition"
                                                onClick={() => alert(`Package Feedback:\nPackage: ${pkg.title}\nRating: ${pkg.rating || 'No ratings yet'}\nReviews: ${pkg.reviewCount || 0} reviews\nComments: ${pkg.commentCount || 0} comments`)}
                                                title="View Comments & Reviews"
                                            />
                                        </div>
                                        <FaTrash
                                            className="text-red-500 cursor-pointer hover:text-red-700 transition"
                                            onClick={() => handleDeletePackage(pkg._id)}
                                            title="Delete Package"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {packages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No course packages yet</h3>
                        <p className="text-gray-500">
                            {courses.length < 2
                                ? "Create at least 2 courses first, then bundle them into packages"
                                : "Create your first course package to offer bundled pricing to learners"
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Create Package Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white bg-opacity-98 backdrop-blur-sm rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Create Course Package</h2>
                        <p className="text-gray-600 text-sm mb-4">Bundle your courses together to offer at a discounted price</p>

                        <form onSubmit={handleCreatePackage}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Package Title *</label>
                                    <input
                                        type="text"
                                        value={newPackage.title}
                                        onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Enter package title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={newPackage.duration}
                                        onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="e.g., 6 months"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description *</label>
                                <textarea
                                    value={newPackage.description}
                                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Describe your package"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Select Your Courses (minimum 2) *
                                    <span className="text-gray-500 text-xs block">Choose from the courses you've created</span>
                                </label>
                                {courses.length === 0 ? (
                                    <div className="border rounded p-4 text-center text-gray-500">
                                        <p>No courses found. Please create some courses first.</p>
                                    </div>
                                ) : (
                                    <div className="border rounded p-3 max-h-48 overflow-y-auto">
                                        {courses.map((course) => (
                                            <div key={course._id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0">
                                                <label className="flex items-center flex-1 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newPackage.selectedCourses.includes(course._id)}
                                                        onChange={() => toggleCourseSelection(course._id)}
                                                        className="mr-3"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium text-gray-800">{course.title}</span>
                                                        {course.description && (
                                                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{course.description}</p>
                                                        )}
                                                        <span className="text-xs text-purple-600">
                                                            {course.pricingPlan === 'free' ? 'Free Course' : `Paid Course`}
                                                        </span>
                                                    </div>
                                                </label>
                                                <div className="text-right ml-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {course.price > 0 ? `₹${course.price}` : 'Free'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {newPackage.selectedCourses.length > 0 && (
                                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                                        <div className="text-sm text-blue-700">
                                            <strong>Selected:</strong> {newPackage.selectedCourses.length} courses |
                                            <strong> Total value:</strong> ₹{calculateTotalCoursesPrice()}
                                        </div>
                                    </div>
                                )}
                                {newPackage.selectedCourses.length === 1 && (
                                    <div className="mt-2 text-sm text-amber-600">
                                        Please select at least 2 courses to create a package
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newPackage.totalPrice}
                                        onChange={(e) => setNewPackage({ ...newPackage, totalPrice: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Original price"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Discounted Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newPackage.discountedPrice}
                                        onChange={(e) => setNewPackage({ ...newPackage, discountedPrice: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Selling price"
                                        required
                                    />
                                </div>
                            </div>

                            {newPackage.totalPrice && newPackage.discountedPrice && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                                    <div className="text-sm text-green-700">
                                        Savings: ₹{parseInt(newPackage.totalPrice) - parseInt(newPackage.discountedPrice)}
                                        ({Math.round(((parseInt(newPackage.totalPrice) - parseInt(newPackage.discountedPrice)) / parseInt(newPackage.totalPrice)) * 100)}% off)
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Create Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
