import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState("free");
  const [totalPrice, setTotalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/api/course/${id}`)
        .then((res) => {
          const course = res.data;
          setTitle(course.title);
          setDescription(course.description);
          setPlan(course.pricingPlan);
          setTotalPrice(course.totalPrice);
          setDiscountedPrice(course.discountedPrice);
          if (course.coverImage) {
            setCoverPreview(`http://localhost:3001${course.coverImage}`);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch course:", err);
        });
    }
  }, [id]);

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

  const handleNext = async (e) => {
    e.preventDefault();

    if (!title || !description || (!coverImage && !id)) {
      alert("Please fill all required fields including cover image.");
      return;
    }

    if (plan === "one-time" && (!totalPrice || !discountedPrice)) {
      alert("Please enter total and discounted price for one-time plan.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("pricingPlan", plan);
      formData.append("totalPrice", plan === "one-time" ? totalPrice : 0);
      formData.append("discountedPrice", plan === "one-time" ? discountedPrice : 0);
      if (coverImage) formData.append("coverImage", coverImage);

      const token = localStorage.getItem("token"); // 👈 fetch token

      let response;
      if (id) {
        response = await axios.put(
          `http://localhost:3001/api/course/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // 👈 attach token
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3001/api/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // 👈 attach token
            },
          }
        );
      }

      alert("✅ Course saved successfully!");
      const courseId = response.data._id || id;
      navigate(`/course-content/${courseId}`);
    } catch (error) {
      console.error("❌ Error saving course:", error);
      alert("Failed to save course.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <form
        onSubmit={handleNext}
        encType="multipart/form-data"
        className="flex-1 bg-white min-h-screen"
      >
        <div className="flex justify-between items-center p-14 border-b shadow-sm sticky top-0 bg-white z-20">
          <div className="flex items-center space-x-3">
            <FaArrowLeft
              className="text-gray-700 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-xl font-semibold">
              {id ? "Edit Course" : "Create a course"}
            </h2>
          </div>
          {!id && (
            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
            >
              Next
            </button>
          )}
        </div>

        <div className="p-8">
          <label className="block font-medium mb-1">Title *</label>
          <input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <label className="block font-medium mb-1">Description *</label>
          <textarea
            placeholder="Write course description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
            className="border p-2 rounded w-full mb-6"
          />

          <label className="block font-medium mb-1 mt-4">Cover Image *</label>
          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Preview"
              className="h-40 w-full object-cover rounded mb-2"
            />
          ) : (
            <div className="h-40 w-full flex items-center justify-center text-gray-500 bg-gray-100 rounded mb-2">
              No Cover
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full"
          />

          <label className="block font-medium text-lg mb-2 mt-6">Set pricing</label>
          <div className="space-y-4">
            <label className="block border p-4 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="pricing"
                  value="free"
                  checked={plan === "free"}
                  onChange={() => setPlan("free")}
                />
                <div>
                  <div className="font-semibold">Free plan</div>
                  <div className="text-sm text-gray-600">
                    Allow unrestricted access to your content free of cost
                  </div>
                </div>
              </div>
            </label>

            <label className="block border p-4 rounded-lg cursor-pointer bg-gray-50 ring-1 ring-blue-300">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="radio"
                  name="pricing"
                  value="one-time"
                  checked={plan === "one-time"}
                  onChange={() => setPlan("one-time")}
                />
                <div>
                  <div className="font-semibold">One-time plan</div>
                  <div className="text-sm text-gray-600">
                    Allow full course access with a single payment
                  </div>
                </div>
              </div>

              {plan === "one-time" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 font-medium">Total price *</label>
                    <div className="flex items-center border rounded overflow-hidden">
                      <span className="px-3 text-gray-600 bg-gray-100">₹</span>
                      <input
                        type="number"
                        value={totalPrice}
                        onChange={(e) => setTotalPrice(e.target.value)}
                        className="w-full p-2 outline-none"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-medium">Discounted price *</label>
                    <div className="flex items-center border rounded overflow-hidden">
                      <span className="px-3 text-gray-600 bg-gray-100">₹</span>
                      <input
                        type="number"
                        value={discountedPrice}
                        onChange={(e) => setDiscountedPrice(e.target.value)}
                        className="w-full p-2 outline-none"
                        placeholder="Enter discounted price"
                      />
                    </div>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="bg-indigo-50 text-indigo-700 p-3 mt-4 text-sm border-l-4 border-indigo-500 rounded">
            💡 You can add multiple pricing options and access advanced plans later under course pricing.
          </div>
        </div>
      </form>
    </div>
  );
}
