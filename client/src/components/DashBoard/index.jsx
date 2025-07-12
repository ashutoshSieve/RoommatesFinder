import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchProfileCard from "../MatchProfile";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");

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

  const getMatches = async () => {
    try {
      const res = await fetch("https://roommatesfinder-1.onrender.com/api/match", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getUser();
    getMatches();
  }, []);

  const handleMessage = (matchId) => {
    navigate(`/message/${matchId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={() => setUser(null)} />

      <main className="flex-grow bg-gray-50 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="max-w-5xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            🏠 Dashboard
          </h1>

          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center text-sm">
              {error}
            </p>
          )}

          {user && (
            <div className="mb-6 p-6 bg-white rounded-xl shadow text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome, {user.name} 👋
              </h2>
              <p className="text-gray-500 text-sm">Email: {user.email}</p>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 text-indigo-600">
            Potential Matches
          </h2>

          {matches.length === 0 ? (
            <p className="text-gray-500 text-center">No matches found yet.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {matches.map((match) => (
                <MatchProfileCard
                  key={match._id}
                  user={match}
                  handleMessage={handleMessage}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
