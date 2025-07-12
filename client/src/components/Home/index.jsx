import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Find Your Perfect Roommate 👭👬
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-6">
        Welcome to RoommateFinder — a platform where you can find compatible
        roommates based on lifestyle, food habits, cleanliness, and more!
      </p>

      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-medium transition"
        >
          Login
        </Link>
      </div>

      <div className="mt-10">
        <img
          src="\image\im1.jpg"
          alt="Roommate Match"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </div>
  );
};

export default Home;
