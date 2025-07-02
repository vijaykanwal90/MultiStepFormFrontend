import { useState } from "react";
import axios from "axios";
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { BASE_URL } from "../constants/constant";

const Step1PersonalInfo = ({ formData, updateField, nextStep }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(
    formData.profilePhoto instanceof File
      ? URL.createObjectURL(formData.profilePhoto)
      : formData.profilePhoto
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const validateAndNext = async () => {
    const { userName, profilePhoto, newPassword, currentPassword, dob, gender } = formData;
    const usernameRegex = /^[^\s]{4,20}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

    if (!profilePhoto) return setError("Profile photo is required");
    if (!usernameRegex.test(userName)) return setError("Username must be 4-20 characters with no spaces");
    if (newPassword && !passwordRegex.test(newPassword)) {
      return setError("Password must contain at least one symbol and one number");
    }

    const selectedDate = new Date(dob);
    const now = new Date();
    if (dob && selectedDate > now) return setError("Date of birth cannot be in the future");
    if (!gender) return setError("Please select a gender");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/user/validate-personalData`,
        { userName, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setError("");
        nextStep();
      } else {
        setError(res.data.message || "Validation failed");
      }
    } catch (err) {
      console.error("Validation error:", err);
      const backendMessage = err?.response?.data?.message || "Server error during validation";
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
      if(file.size > 2 * 1024 * 1024) {
        return setError("File size exceeds 2MB limit.");
      }
    if (file && (file.type === "image/png" || file.type === "image/jpg")) {
      updateField("profilePhoto", file);
      setPreview(URL.createObjectURL(file));
    } else {
      setError("Only JPG and PNG files are allowed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Info</h2>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Profile Photo Upload */}
        <div className="flex items-center gap-6 flex-col sm:flex-row">
          <div>
            {preview && (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
            )}
          </div>
          <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition duration-200">
            Upload Image
            <input
              type="file"
              accept="image/png, image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter a username"
            className="w-full p-2 border rounded"
            value={formData.userName}
            onChange={(e) => updateField("userName", e.target.value)}
          />
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password (optional)"
              className={`w-full p-2 border rounded pr-10 ${
                error.toLowerCase().includes("password") ? "border-red-500" : ""
              }`}
              value={formData.currentPassword}
              onChange={(e) => updateField("currentPassword", e.target.value)}
            />
            <span
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            >
              {showCurrentPassword ? <FaRegEyeSlash size={20} /> : <IoEyeOutline size={20} />}
            </span>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-2 border rounded pr-10"
              value={formData.newPassword}
              onChange={(e) => updateField("newPassword", e.target.value)}
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            >
              {showNewPassword ? <FaRegEyeSlash size={20} /> : <IoEyeOutline size={20} />}
            </span>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            max={today}
            onChange={(e) => updateField("dob", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.gender === "Other" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Please specify</label>
            <input
              type="text"
              value={formData.otherGender || ""}
              onChange={(e) => updateField("otherGender", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your gender identity"
              required
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Navigation Button */}
        <div className="pt-4">
          <button
            onClick={validateAndNext}
            disabled={loading}
            className={`px-6 py-2 rounded w-full sm:w-auto transition duration-200 text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-10 10h4z"
                  ></path>
                </svg>
                Validating...
              </span>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;
