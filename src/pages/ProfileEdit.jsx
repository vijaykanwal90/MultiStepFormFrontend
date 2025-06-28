import React, { useState, useEffect } from "react";
import Step1PersonalInfo from "../components/Step1PersonalInfo";
import Step2ProfessionalDetails from "../components/Step2ProfessionalDetails";
import Step3Preferences from "../components/Step3Preferences";
import Summary from "../components/Summary";
import axios from "axios";
import { BASE_URL } from "../constants/constant"; 

const ProfileEdit = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    profilePhoto: null,
    userName: "",
    email: "",
    currentPassword: "Vijay@123",
    newPassword: "Vijay@321",
    profession: "",
    companyName: "",
    addressLine1: "almora",
    country: "",
    state: "",
    city: "",
    subscriptionPlan: "Basic",
    newsletter: true,
    gender:"",
    dob: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;
        console.log("Fetched user data:", data);

        setFormData((prev) => ({
          ...prev,
          profilePhoto: data.profilePhoto || null,               // Mapped
          userName: data.userName || "",
          email: data.email || "",
          profession: data.profession || "",
          companyName: data.companyName || "",
          addressLine1: data.address || "",                // Mapped
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          subscriptionPlan: data.subscription || "Basic",  // Mapped
          newsletter: data.newsLetter ?? true,             // Mapped
        }));
      } catch (err) {
        console.error(" Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 border rounded-lg shadow-md bg-white">
      {step === 1 && (
        <Step1PersonalInfo
          formData={formData}
          updateField={updateField}
          nextStep={nextStep}
        />
      )}
      {step === 2 && (
        <Step2ProfessionalDetails
          formData={formData}
          updateField={updateField}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3Preferences
          formData={formData}
          updateField={updateField}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 4 && (
        <Summary
          formData={formData}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

export default ProfileEdit;
