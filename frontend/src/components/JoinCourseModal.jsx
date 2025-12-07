import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useAuthStore } from "../stores/authStore";
import { showToast } from "./Toast";
import { TOAST_TYPES } from "../utils/constants";
import { API_ENDPOINTS } from "../utils/constants";
import LoadingSpinner from "./LoadingSpinner";
import FormInput from "./FormInput";

export default function JoinCourseModal({ onClose, onJoined }) {
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const { token } = useAuthStore();
    const { get, post, loading } = useApi();
    
    const fetchCourse = async (courseId) => {
        try {
            const data = await get(API_ENDPOINTS.COURSE(courseId), { showErrorToast: false });
            return data;
        } catch (err) {
            return null;
        }
    };

    const handleJoin = async () => {
        if (!link.trim()) {
            setError("Please enter a course link or ID");
            return;
        }

        // expect link like http://localhost:5173/courses/enroll/<courseId> or just the id
        let courseId = link.trim();
        const maybe = courseId.match(/([a-f0-9]{24})$/i);
        if (maybe) courseId = maybe[1];
        else if (!/^[a-f0-9]{24}$/i.test(courseId)) {
            setError("Invalid course ID or link format");
            return;
        }

        setError("");

        try {
            // fetch course info first to check pricing
            const fetched = await fetchCourse(courseId);
            if (!fetched) {
                setError("Course not found. Please check the link or ID.");
                return;
            }

            if (fetched.pricingPlan === 'one-time') {
                // Use Razorpay: create order on server
                try {
                    const orderData = await post(API_ENDPOINTS.CREATE_ORDER(courseId), {}, { showErrorToast: false });
                    const { order, key_id } = orderData;

                    // load razorpay script
                    await new Promise((resolve, reject) => {
                        if (window.Razorpay) {
                            resolve();
                            return;
                        }
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });

                    const options = {
                        key: key_id,
                        amount: order.amount,
                        currency: order.currency,
                        name: fetched.title,
                        description: 'Course purchase',
                        order_id: order.id,
                        handler: async function (response) {
                            // verify on server
                            try {
                                await post(API_ENDPOINTS.VERIFY_PAYMENT(courseId), {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature
                                }, { showErrorToast: false });
                                
                                showToast(TOAST_TYPES.SUCCESS, 'Payment successful! You have been enrolled in the course.');
                                if (onJoined) onJoined();
                                onClose();
                            } catch (ve) {
                                showToast(TOAST_TYPES.ERROR, 'Payment verification failed. Please contact support.');
                            }
                        },
                        prefill: { email: '', name: '' },
                        notes: { courseId },
                        theme: { color: '#7c3aed' }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                    return;
                } catch (errOrder) {
                    const errorMsg = errOrder.response?.data?.error || 'Failed to initiate payment';
                    setError(errorMsg);
                    showToast(TOAST_TYPES.ERROR, errorMsg);
                    return;
                }
            }

            // Free course or enroll-by-link
            const res = await post(API_ENDPOINTS.ENROLL_COURSE(courseId), {}, { showErrorToast: false });
            showToast(TOAST_TYPES.SUCCESS, res.message || "Successfully enrolled in the course!");
            if (onJoined) onJoined();
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to enroll. Please check the link and ensure you're logged in as a student.";
            setError(errorMsg);
            showToast(TOAST_TYPES.ERROR, errorMsg);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Join Course
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Paste the course link or course ID shared by the teacher.
                    </p>
                    <FormInput
                        label="Course Link or ID"
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value);
                            setError("");
                        }}
                        placeholder="https://.../courses/enroll/<id> or <courseId>"
                        error={error}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleJoin} 
                            disabled={loading || !link.trim()}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span>Joining...</span>
                                </>
                            ) : (
                                'Join Course'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
