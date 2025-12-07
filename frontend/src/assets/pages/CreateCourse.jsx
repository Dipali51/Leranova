import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";
import { useApi } from "../../hooks/useApi";
import { useAuthStore } from "../../stores/authStore";
import { showToast } from "../../components/Toast";
import { TOAST_TYPES } from "../../utils/constants";
import { API_ENDPOINTS } from "../../utils/constants";
import FormInput from "../../components/FormInput";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [plan, setPlan] = useState("free");
  const [totalPrice, setTotalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [payoutProof, setPayoutProof] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { get, post, put, loading } = useApi();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const course = await get(API_ENDPOINTS.COURSE(id), { showErrorToast: false });
          setTitle(course.title || "");
          setDescription(course.description || "");
          setInstructor(course.instructor || "");
          setPlan(course.pricingPlan || "free");
          setTotalPrice(course.totalPrice || "");
          setDiscountedPrice(course.discountedPrice || "");
          if (course.coverImage) {
            setCoverPreview(`http://localhost:3001${course.coverImage}`);
          }
        } catch (err) {
          showToast(TOAST_TYPES.ERROR, "Failed to load course details");
        }
      };
      fetchCourse();
    }
  }, [id, get]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Course title is required";
    if (!description.trim()) newErrors.description = "Course description is required";
    if (!coverImage && !id) newErrors.coverImage = "Cover image is required";
    if (plan === "one-time") {
      if (!totalPrice) newErrors.totalPrice = "Total price is required";
      if (!discountedPrice) newErrors.discountedPrice = "Discounted price is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(TOAST_TYPES.ERROR, "Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("instructor", instructor);
      formData.append("pricingPlan", plan);
      formData.append("totalPrice", plan === "one-time" ? totalPrice : 0);
      formData.append("discountedPrice", plan === "one-time" ? discountedPrice : 0);
      if (coverImage) formData.append("coverImage", coverImage);
      // Payout details for paid courses
      if (plan === "one-time") {
        if (bankName) formData.append("bankName", bankName);
        if (accountNumber) formData.append("accountNumber", accountNumber);
        if (ifsc) formData.append("ifsc", ifsc);
        if (beneficiaryName) formData.append("beneficiaryName", beneficiaryName);
        if (payoutProof) formData.append("payoutProof", payoutProof);
      }

      let response;
      if (id) {
        response = await put(
          API_ENDPOINTS.UPDATE_COURSE(id),
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            showErrorToast: false,
          }
        );
      } else {
        response = await post(
          API_ENDPOINTS.CREATE_COURSE,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            showErrorToast: false,
          }
        );
      }

      showToast(TOAST_TYPES.SUCCESS, "Course saved successfully!");
      const courseId = response._id || id;
      setTimeout(() => {
        navigate(`/course-content/${courseId}`);
      }, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save course";
      showToast(TOAST_TYPES.ERROR, errorMsg);
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      showToast(TOAST_TYPES.ERROR, "Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("instructor", instructor);
      formData.append("pricingPlan", plan);
      formData.append("totalPrice", plan === "one-time" ? totalPrice : 0);
      formData.append("discountedPrice", plan === "one-time" ? discountedPrice : 0);
      if (coverImage) formData.append("coverImage", coverImage);
      if (plan === "one-time") {
        if (bankName) formData.append("bankName", bankName);
        if (accountNumber) formData.append("accountNumber", accountNumber);
        if (ifsc) formData.append("ifsc", ifsc);
        if (beneficiaryName) formData.append("beneficiaryName", beneficiaryName);
        if (payoutProof) formData.append("payoutProof", payoutProof);
      }

      await put(
        API_ENDPOINTS.UPDATE_COURSE(id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          showErrorToast: false,
        }
      );

      showToast(TOAST_TYPES.SUCCESS, "Course updated successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to update course";
      showToast(TOAST_TYPES.ERROR, errorMsg);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <form
        onSubmit={handleNext}
        encType="multipart/form-data"
        className="flex-1 bg-gradient-to-br from-gray-50 to-violet-50 min-h-screen"
      >
        <div className="flex justify-between items-center p-6 border-b shadow-md sticky top-0 bg-white z-20">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-gray-700" />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {id ? "Edit Course" : "Create a Course"}
            </h2>
          </div>
          <div className="flex space-x-3">
            {id && (
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={loading}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : null}
                Save Changes
              </button>
            )}
            {!id && (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : null}
                Next: Add Content
              </button>
            )}
          </div>
        </div>

        <div className="p-8 max-w-4xl mx-auto">
          <FormInput
            label="Course Title"
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({ ...errors, title: "" });
            }}
            error={errors.title}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write a detailed course description..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              rows="6"
              className={`w-full px-4 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white hover:border-violet-400"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠</span>
                {errors.description}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
            {coverPreview ? (
              <div className="mb-3 relative group">
                <img
                  src={coverPreview}
                  alt="Preview"
                  className="h-64 w-full object-cover rounded-xl shadow-md border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview("");
                    setCoverImage(null);
                    setErrors({ ...errors, coverImage: "" });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl border-2 border-dashed border-gray-300 mb-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">No cover image selected</div>
                </div>
              </div>
            )}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="inline-block px-4 py-2 bg-violet-600 text-white rounded-lg cursor-pointer hover:bg-violet-700 transition font-medium">
                {coverPreview ? "Change Image" : "Upload Cover Image"}
              </span>
            </label>
            {errors.coverImage && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠</span>
                {errors.coverImage}
              </p>
            )}
          </div>

          <FormInput
            label="Instructor Name"
            type="text"
            placeholder="Enter instructor full name"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />

          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-4">Set Pricing</label>
          <div className="space-y-4">
            <label
              className={`block border-2 p-5 rounded-xl cursor-pointer transition-all ${
                plan === "free"
                  ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200"
                  : "border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="pricing"
                  value="free"
                  checked={plan === "free"}
                  onChange={() => {
                    setPlan("free");
                    setErrors({ ...errors, totalPrice: "", discountedPrice: "" });
                  }}
                  className="w-5 h-5 text-violet-600"
                />
                <div>
                  <div className="font-bold text-lg">Free Plan</div>
                  <div className="text-sm text-gray-600">
                    Allow unrestricted access to your content free of cost
                  </div>
                </div>
              </div>
            </label>

            <label
              className={`block border-2 p-5 rounded-xl cursor-pointer transition-all ${
                plan === "one-time"
                  ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200"
                  : "border-gray-200 hover:border-violet-300"
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="radio"
                  name="pricing"
                  value="one-time"
                  checked={plan === "one-time"}
                  onChange={() => setPlan("one-time")}
                  className="w-5 h-5 text-violet-600"
                />
                <div>
                  <div className="font-bold text-lg">One-Time Payment Plan</div>
                  <div className="text-sm text-gray-600">
                    Allow full course access with a single payment
                  </div>
                </div>
              </div>

              {plan === "one-time" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Total Price <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent">
                      <span className="px-4 text-gray-600 bg-gray-100 font-medium">₹</span>
                      <input
                        type="number"
                        value={totalPrice}
                        onChange={(e) => {
                          setTotalPrice(e.target.value);
                          setErrors({ ...errors, totalPrice: "" });
                        }}
                        className="w-full p-2.5 outline-none"
                        placeholder="Enter total price"
                        min="0"
                      />
                    </div>
                    {errors.totalPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.totalPrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium text-gray-700">
                      Discounted Price <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border-2 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent">
                      <span className="px-4 text-gray-600 bg-gray-100 font-medium">₹</span>
                      <input
                        type="number"
                        value={discountedPrice}
                        onChange={(e) => {
                          setDiscountedPrice(e.target.value);
                          setErrors({ ...errors, discountedPrice: "" });
                        }}
                        className="w-full p-2.5 outline-none"
                        placeholder="Enter discounted price"
                        min="0"
                      />
                    </div>
                    {errors.discountedPrice && (
                      <p className="mt-1 text-sm text-red-600">{errors.discountedPrice}</p>
                    )}
                  </div>
                </div>
              )}
            </label>
            {/* Bank / payout fields for paid courses */}
            {plan === 'one-time' && (
              <div className="mt-6 border-2 border-violet-200 p-6 rounded-xl bg-violet-50/50">
                <h4 className="font-bold text-lg mb-4 text-gray-900">Payout / Bank Details (Optional)</h4>
                <p className="text-sm text-gray-600 mb-4">Add your bank details to receive payments for this course.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Beneficiary Name"
                    type="text"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="Account holder name"
                  />

                  <FormInput
                    label="Bank Name"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Bank name"
                  />

                  <FormInput
                    label="Account Number"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account number"
                  />

                  <FormInput
                    label="IFSC Code"
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="IFSC code"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payout Proof (Optional)
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setPayoutProof(e.target.files[0])}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition font-medium">
                      {payoutProof ? "Change File" : "Upload Bank Proof"}
                    </span>
                    {payoutProof && (
                      <span className="ml-3 text-sm text-gray-600">{payoutProof.name}</span>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 p-4 mt-6 text-sm border-l-4 border-violet-500 rounded-lg">
            <span className="font-semibold">💡 Tip:</span> You can add multiple pricing options and access advanced plans later under course pricing.
          </div>
        </div>
      </form>
    </div>
  );
}
