import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await fetch("https://roommatesfinder-1.onrender.com/api/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.info);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />

      <div className="min-h-screen bg-gray-50 px-6 py-10 pb-24">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">👤 My Profile</h2>

          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-sm">{error}</p>
          )}

          {user ? (
            <div className="space-y-4 text-gray-700">
              {user.profileImage && (
                <div className="flex justify-center">
                  <img
                    src={`https://roommatesfinder-1.onrender.com${user.profileImage}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500 mb-4"
                  />
                </div>
              )}

              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              {user.city && <p><strong>City:</strong> {user.city}</p>}
              {user.age && <p><strong>Age:</strong> {user.age}</p>}
              {user.occupation && <p><strong>Occupation:</strong> {user.occupation}</p>}

              {user.preferences && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-indigo-600 mb-2">Preferences:</h3>
                  <ul className="space-y-1">
                    <li><strong>Looking For:</strong> {user.preferences.genderPreference}</li>
                    <li><strong>Smoker:</strong> {user.preferences.smoking ? "Yes" : "No"}</li>
                    <li><strong>Room Sharing:</strong> {user.preferences.roomSharing ? "Yes" : "No"}</li>
                    <li><strong>Budget Range:</strong> {user.preferences.budgetRange || "Not specified"}</li>
                    <li><strong>Preferred Location:</strong> {user.preferences.location || "Not specified"}</li>
                    <li><strong>Pets Allowed:</strong> {user.preferences.petsAllowed ? "Yes" : "No"}</li>
                    <li><strong>Food Habit:</strong> {user.preferences.foodHabit || "Not specified"}</li>
                    <li><strong>Sleep Schedule:</strong> {user.preferences.sleepSchedule || "Not specified"}</li>
                    <li><strong>Cleanliness Level:</strong> {user.preferences.cleanlinessLevel || "Not specified"}</li>
                    <li><strong>Noise Tolerance:</strong> {user.preferences.noiseTolerance || "Not specified"}</li>
                  </ul>
                </div>
              )}

              <div className="pt-6 text-right">
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            !error && <p className="text-gray-500">Loading user info...</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyPage;
