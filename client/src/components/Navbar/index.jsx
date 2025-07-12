import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    fetch("https://roommatesfinder-1.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        onLogout();
        navigate("/");
      })
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">🏠 Roommate Finder</div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0`}
        >
          <Link to="/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/profile" className="block hover:underline">
            Profile
          </Link>
          <Link to="/chat" className="block hover:underline">
            Chat History
          </Link>

          <Link to="/mypage" className="block hover:underline">
            {user && (
              <span className="bg-white text-indigo-600 px-3 py-1 rounded-full font-medium text-sm">
                {user.name}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
