import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(`${BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top bar with logout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user.profilePhoto || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />
          <div className="text-center sm:text-left w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.userName}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user.profession && <p className="text-gray-600">{user.profession}</p>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <Info label="Company" value={user.companyName} />
          <Info label="Address" value={user.addressLine1} />
          <Info label="Country" value={user.country} />
          <Info label="State" value={user.state} />
          <Info label="City" value={user.city} />
          <Info label="Gender" value={user.gender} />
          <Info label="Date of Birth" value={formatDate(user.dob)} />
          <Info label="Subscription" value={user.subscriptionPlan} />
          <Info label="Newsletter" value={user.newsletter ? "Yes" : "No"} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 font-medium">{label}</p>
    <p className="text-gray-800 break-words">{value || "-"}</p>
  </div>
);

export default Profile;
