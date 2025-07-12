import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ProfileSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    city: "",
    age: "",
    occupation: "",
    genderPreference: "",
    isSmoker: false,
    roomSharing: false,
    petsAllowed: false,
    budgetRange: "",
    location: "",
    cleanlinessLevel: "average",
    noiseTolerance: "moderate",
    foodHabit: "vegetarian",
    sleepSchedule: "early",
    profileImage: null,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });

      const res = await fetch("https://roommatesfinder-1.onrender.com/api/userUpdate", {
        method: "PUT",
        credentials: "include",
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar user={{ name: "You" }} onLogout={() => {}} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 pt-6 pb-20">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
            Complete Your Profile
          </h2>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />

            <input
              type="text"
              name="city"
              placeholder="Preferred City"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Your Age"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
              required
              min="0"
            />

            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            />

            <select
              name="genderPreference"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
              required
            >
              <option value="">Looking For (Gender)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>

            <input
              type="text"
              name="budgetRange"
              placeholder="Your Budget Range (e.g., ₹8,000 - ₹12,000)"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Preferred Locality"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            />

            <select
              name="cleanlinessLevel"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            >
              <option value="average">Cleanliness Level</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>

            <select
              name="noiseTolerance"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            >
              <option value="moderate">Noise Tolerance</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>

            <select
              name="foodHabit"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            >
              <option value="vegetarian">Food Habit</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>

            <select
              name="sleepSchedule"
              className="w-full border border-gray-300 rounded px-4 py-2"
              onChange={handleChange}
            >
              <option value="early">Sleep Schedule</option>
              <option value="early">Early Bird</option>
              <option value="night">Night Owl</option>
              <option value="flexible">Flexible</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isSmoker"
                onChange={handleChange}
                id="smoker"
              />
              <label htmlFor="smoker">I smoke</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="roomSharing"
                onChange={handleChange}
                id="roomSharing"
              />
              <label htmlFor="roomSharing">Open to Room Sharing</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="petsAllowed"
                onChange={handleChange}
                id="petsAllowed"
              />
              <label htmlFor="petsAllowed">I can live with pets</label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProfileSetup;
