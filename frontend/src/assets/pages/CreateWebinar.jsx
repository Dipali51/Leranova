import React, { useState } from 'react';
import Sidebar from '../../layout/Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaVideo, FaCalendarAlt, FaClock, FaUsers, FaFileImage } from 'react-icons/fa';

export default function CreateWebinar() {
    const navigate = useNavigate();
    const [webinarData, setWebinarData] = useState({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endTime: '',
        maxAttendees: '',
        meetingPlatform: 'zoom',
        meetingLink: '',
        coverImage: null,
        isRecorded: false,
        requiresRegistration: true,
        tags: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWebinarData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setWebinarData(prev => ({
            ...prev,
            coverImage: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!webinarData.title || !webinarData.description || !webinarData.startDate || !webinarData.startTime || !webinarData.endTime) {
            alert('Please fill in all required fields');
            return;
        }

        // Create start and end datetime
        const startDateTime = new Date(`${webinarData.startDate}T${webinarData.startTime}`);
        const endDateTime = new Date(`${webinarData.startDate}T${webinarData.endTime}`);

        // Validation: End time should be after start time
        if (endDateTime <= startDateTime) {
            alert('End time must be after start time');
            return;
        }

        // Validation: Start time should be in the future
        if (startDateTime <= new Date()) {
            alert('Webinar start time must be in the future');
            return;
        }

        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        if (!userId) {
            alert("Error: Please login to create webinars.");
            return;
        }

        // Create webinar object
        const newWebinar = {
            _id: Date.now().toString(),
            title: webinarData.title,
            description: webinarData.description,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            maxAttendees: webinarData.maxAttendees || null,
            meetingPlatform: webinarData.meetingPlatform,
            meetingLink: webinarData.meetingLink,
            coverImage: webinarData.coverImage ? URL.createObjectURL(webinarData.coverImage) : null,
            isRecorded: webinarData.isRecorded,
            requiresRegistration: webinarData.requiresRegistration,
            tags: webinarData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdBy: userId,
            createdAt: new Date().toISOString(),
            registeredCount: 0,
            attendedCount: 0,
            rating: null,
            reviewCount: 0,
            questionCount: 0
        };

        // Save to localStorage
        const userWebinarsKey = `userWebinars_${userId}`;
        const existingWebinars = JSON.parse(localStorage.getItem(userWebinarsKey) || '[]');
        const updatedWebinars = [...existingWebinars, newWebinar];
        localStorage.setItem(userWebinarsKey, JSON.stringify(updatedWebinars));

        console.log("✅ Webinar created successfully:", newWebinar);
        alert("✅ Webinar created successfully!");
        navigate('/webinar');
    };

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Webinar</h1>
                    <p className="text-gray-600">Set up your live webinar session</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaVideo className="inline mr-2 text-purple-600" />
                                    Webinar Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={webinarData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter webinar title"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={webinarData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Describe your webinar..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendarAlt className="inline mr-2 text-purple-600" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={webinarData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaClock className="inline mr-2 text-purple-600" />
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={webinarData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={webinarData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Platform and Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaUsers className="inline mr-2 text-purple-600" />
                                    Max Attendees
                                </label>
                                <input
                                    type="number"
                                    name="maxAttendees"
                                    value={webinarData.maxAttendees}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meeting Platform
                                </label>
                                <select
                                    name="meetingPlatform"
                                    value={webinarData.meetingPlatform}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="zoom">Zoom</option>
                                    <option value="teams">Microsoft Teams</option>
                                    <option value="meet">Google Meet</option>
                                    <option value="webex">Cisco Webex</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Meeting Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Link
                            </label>
                            <input
                                type="url"
                                name="meetingLink"
                                value={webinarData.meetingLink}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaFileImage className="inline mr-2 text-purple-600" />
                                Cover Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {webinarData.coverImage && (
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(webinarData.coverImage)}
                                        alt="Cover preview"
                                        className="w-32 h-20 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={webinarData.tags}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter tags separated by commas (e.g., tech, business, marketing)"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isRecorded"
                                    checked={webinarData.isRecorded}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    Record this webinar
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="requiresRegistration"
                                    checked={webinarData.requiresRegistration}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    Require registration to attend
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/webinar')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                Create Webinar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}