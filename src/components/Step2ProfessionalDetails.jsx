import React from "react";

const Step2ProfessionalDetails = ({ formData, updateField, nextStep, prevStep }) => {
  const handleProfessionChange = (e) => {
    updateField("profession", e.target.value);
    if (e.target.value !== "Entrepreneur") updateField("companyName", "");
  };

  const isValid = formData.addressLine1 && formData.profession && (formData.profession !== "Entrepreneur" || formData.companyName);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
      <select value={formData.profession} onChange={handleProfessionChange} className="w-full p-2 border rounded">
        <option value="">Select Profession</option>
        <option value="Student">Student</option>
        <option value="Developer">Developer</option>
        <option value="Entrepreneur">Entrepreneur</option>
      </select>
      {formData.profession === "Entrepreneur" && (
        <input type="text" placeholder="Company Name" className="w-full p-2 border rounded mt-2" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} />
      )}
      <input type="text" placeholder="Address Line 1" className="w-full p-2 border rounded mt-2" value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} />

      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">Back</button>
        <button onClick={nextStep} disabled={!isValid} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Step2ProfessionalDetails;