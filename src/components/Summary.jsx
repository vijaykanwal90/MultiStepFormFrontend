import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/constant";

const Summary = ({ formData, prevStep }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const form = new FormData();

      if (formData.profilePhoto) {
        form.append("profilePhoto", formData.profilePhoto);
      }

      form.append("formData", JSON.stringify({
        userName: formData.userName,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        profession: formData.profession,
        companyName: formData.companyName,
        addressLine1: formData.addressLine1,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        subscriptionPlan: formData.subscriptionPlan,
        newsletter: formData.newsletter,
        gender: formData.gender,
        dob: formData.dob,
      }));

      const res = await axios.patch(`${BASE_URL}/user/profileEdit`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        console.log("Profile updated successfully");
        navigate("/profile");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label, value) => (
    <div className="flex justify-between border-b py-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-600 text-right break-words max-w-[60%]">
        {value ? value.toString() : "-"}
      </span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Submit</h2>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Your Information</h3>

        <div className="divide-y text-sm">
          {renderField("Username", formData.userName)}
          {renderField("Email", formData.email)}
          {renderField("Profession", formData.profession)}
          {renderField("Company Name", formData.companyName)}
          {renderField("Address", formData.addressLine1)}
          {renderField("Gender", formData.gender)}
          {renderField("Country", formData.country)}
          {renderField("State", formData.state)}
          {renderField("City", formData.city)}
          {renderField("Subscription Plan", formData.subscriptionPlan)}
          {renderField("Newsletter", formData.newsletter ? "Yes" : "No")}
        </div>

        {formData.profilePhoto && (
          <div className="mt-4">
            <span className="block font-medium text-gray-700 mb-2">Profile Photo</span>
            <img
             src={
              typeof formData.profilePhoto === "string"
                ? formData.profilePhoto
                : URL.createObjectURL(formData.profilePhoto)
            }
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
        <button
          onClick={prevStep}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition duration-200 w-full sm:w-auto"
          disabled={loading}
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${
            loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
          } text-white px-6 py-2 rounded transition duration-200 w-full sm:w-auto flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default Summary;
