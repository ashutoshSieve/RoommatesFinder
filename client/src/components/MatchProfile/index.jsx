import React from "react";
import { useNavigate } from "react-router-dom";

const MatchProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const {
    _id,
    name,
    email,
    age,
    gender,
    city,
    profileImage,
    compatibility,
    preferences = {},
  } = user;

  const {
    isSmoker,
    roomSharing,
    genderPreference,
    location,
    budgetRange,
    cleanlinessLevel,
    noiseTolerance,
    petsAllowed,
    sleepSchedule,
    foodHabit,
  } = preferences;

  const handleMessage = () => {
    navigate(`/message/${_id}`);
  };

  const imageUrl = profileImage
    ? `https://roommatesfinder-1.onrender.com${profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=4f46e5&color=fff`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex gap-5 items-start hover:shadow-lg transition-all duration-300">
      
      <img
        src={imageUrl}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
      />

      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <p className="text-sm text-gray-600">Age: {age || "N/A"}</p>
            <p className="text-sm text-gray-600">Gender: {gender || "N/A"}</p>
            <p className="text-sm text-gray-600">City: {city || location || "N/A"}</p>
            <p className="text-sm text-gray-600">Budget: {budgetRange || "Not set"}</p>
            <p className="text-sm text-gray-600">
              {isSmoker ? "Smoker" : "Non-Smoker"},{" "}
              {roomSharing ? "Room Sharing" : "Private Room"}
            </p>
          </div>

          
          {compatibility !== undefined && (
            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {compatibility}% Match
            </span>
          )}
        </div>

        
        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
          {cleanlinessLevel && <p>🧹 Cleanliness: {cleanlinessLevel}</p>}
          {noiseTolerance && <p>🔊 Noise: {noiseTolerance}</p>}
          {sleepSchedule && <p>🌙 Sleep: {sleepSchedule}</p>}
          {foodHabit && <p>🍱 Food: {foodHabit}</p>}
          <p>🐾 Pets: {petsAllowed ? "Allowed" : "Not Allowed"}</p>
        </div>

        
        <button
          onClick={handleMessage}
          className="mt-4 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default MatchProfileCard;
